const BASELINE_DURATION_MS = 30_000;

let baselineSamples = [];

export function updateBaselineEngine(session, signals) {
  if (session.status !== "recording") {
    return null;
  }

  if (!session.startedAt) {
    return null;
  }

  const elapsedMs = performance.now() - session.startedAt;

  if (elapsedMs > BASELINE_DURATION_MS) {
    return buildBaseline();
  }

  baselineSamples.push({
    time: performance.now(),
    eyeOpenness: signals.eyeOpenness,
    blinkRate: signals.blinkRate,
    headStability: signals.headStability,
    headTilt: signals.headTilt,
    expressionVariability: signals.expressionVariability,
  });

  return buildBaseline();
}

export function getBaselineProgress(session) {
  if (session.status !== "recording" || !session.startedAt) {
    return 0;
  }

  const elapsedMs = performance.now() - session.startedAt;

  return clamp(elapsedMs / BASELINE_DURATION_MS, 0, 1);
}

function buildBaseline() {
  return {
    eyeOpenness: average("eyeOpenness"),
    blinkRate: average("blinkRate"),
    headStability: average("headStability"),
    headTilt: average("headTilt"),
    expressionVariability: average("expressionVariability"),
    sampleCount: baselineSamples.length,
    durationMs: BASELINE_DURATION_MS,
    complete: baselineSamples.length > 0,
  };
}

export function compareToBaseline(signals, baseline) {
  if (!baseline?.complete) {
    return {
      eyeOpennessDelta: null,
      blinkRateDelta: null,
      headStabilityDelta: null,
      headTiltDelta: null,
      expressionVariabilityDelta: null,
    };
  }

  return {
    eyeOpennessDelta: delta(signals.eyeOpenness, baseline.eyeOpenness),
    blinkRateDelta: delta(signals.blinkRate, baseline.blinkRate),
    headStabilityDelta: delta(signals.headStability, baseline.headStability),
    headTiltDelta: delta(signals.headTilt, baseline.headTilt),
    expressionVariabilityDelta: delta(
      signals.expressionVariability,
      baseline.expressionVariability
    ),
  };
}

export function resetBaselineEngine() {
  baselineSamples = [];
}

function average(key) {
  const values = baselineSamples
    .map(sample => sample[key])
    .filter(value => Number.isFinite(value));

  if (!values.length) return null;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function delta(current, baseline) {
  if (!Number.isFinite(current) || !Number.isFinite(baseline)) {
    return null;
  }

  return current - baseline;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}