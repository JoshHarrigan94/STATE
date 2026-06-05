import { config } from "../config/config.js";

let samples = [];
let blinkEvents = [];
let blinkActive = false;
let blinkStartedAt = null;

export function updateFeatureWindow(signals) {
  const now = performance.now();

  if (!signals) {
    prune(now);

    return {
      eyeOpenness: null,
      blinkRate: 0,
      blinkDuration: null,
      headStability: null,
      headTilt: null,
      faceSize: null,
      expressionVariability: null,
      sampleCount: samples.length,
    };
  }

  samples.push({
    time: now,
    eyeOpenness: signals.eyeOpenness,
    headTilt: signals.headTilt,
    headCentreX: signals.headCentreX,
    headCentreY: signals.headCentreY,
    faceWidth: signals.faceWidth,
    faceHeight: signals.faceHeight,
    blendshapeActivity: signals.blendshapeActivity,
  });

  detectBlink(signals.eyeOpenness, now);
  prune(now);

  return buildFeatures();
}

function detectBlink(eyeOpenness, now) {
  if (!blinkActive && eyeOpenness < config.blink.threshold) {
    blinkActive = true;
    blinkStartedAt = now;
  }

  if (blinkActive && eyeOpenness > config.blink.exitThreshold) {
    const duration = now - blinkStartedAt;

    if (
      duration > config.blink.minDurationMs &&
      duration < config.blink.maxDurationMs
    ) {
      blinkEvents.push({
        time: now,
        duration,
      });
    }

    blinkActive = false;
    blinkStartedAt = null;
  }
}

function prune(now) {
  const windowStart = now - config.features.windowMs;

  samples = samples.filter(sample => sample.time >= windowStart);
  blinkEvents = blinkEvents.filter(event => event.time >= windowStart);
}

function buildFeatures() {
  return {
    eyeOpenness: average("eyeOpenness"),
    blinkRate: blinkEvents.length * (60_000 / config.features.windowMs),
    blinkDuration: averageBlinkDuration(),
    headStability: calculateHeadStability(),
    headTilt: average("headTilt"),
    faceSize: averageFaceSize(),
    expressionVariability: standardDeviation("blendshapeActivity"),
    sampleCount: samples.length,
  };
}

function average(key) {
  const values = samples
    .map(sample => sample[key])
    .filter(value => Number.isFinite(value));

  if (!values.length) return null;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(key) {
  const values = samples
    .map(sample => sample[key])
    .filter(value => Number.isFinite(value));

  if (values.length < config.features.minSamplesForStability) return null;

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    values.length;

  return Math.sqrt(variance);
}

function averageBlinkDuration() {
  if (!blinkEvents.length) return null;

  return (
    blinkEvents.reduce((sum, event) => sum + event.duration, 0) /
    blinkEvents.length
  );
}

function averageFaceSize() {
  if (!samples.length) return null;

  const values = samples
    .map(sample => sample.faceWidth * sample.faceHeight)
    .filter(value => Number.isFinite(value));

  if (!values.length) return null;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateHeadStability() {
  if (samples.length < config.features.minSamplesForStability) return null;

  const movements = [];

  for (let i = 1; i < samples.length; i += 1) {
    const previous = samples[i - 1];
    const current = samples[i];

    const dx = current.headCentreX - previous.headCentreX;
    const dy = current.headCentreY - previous.headCentreY;

    movements.push(Math.sqrt(dx * dx + dy * dy));
  }

  const averageMovement =
    movements.reduce((sum, value) => sum + value, 0) / movements.length;

  const stability = 1 - averageMovement * 80;

  return clamp(stability, 0, 1);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function resetFeatureWindow() {
  samples = [];
  blinkEvents = [];
  blinkActive = false;
  blinkStartedAt = null;
}