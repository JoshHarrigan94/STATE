const WINDOW_MS = 10_000;
const BLINK_THRESHOLD = 0.2;
const BLINK_EXIT_THRESHOLD = 0.24;

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
    };
  }

  samples.push({
    time: now,
    eyeOpenness: signals.eyeOpenness,
  });

  detectBlink(signals.eyeOpenness, now);
  prune(now);

  return buildFeatures(now);
}

function detectBlink(eyeOpenness, now) {
  if (!blinkActive && eyeOpenness < BLINK_THRESHOLD) {
    blinkActive = true;
    blinkStartedAt = now;
  }

  if (blinkActive && eyeOpenness > BLINK_EXIT_THRESHOLD) {
    const duration = now - blinkStartedAt;

    if (duration > 40 && duration < 600) {
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
  const windowStart = now - WINDOW_MS;

  samples = samples.filter(sample => sample.time >= windowStart);
  blinkEvents = blinkEvents.filter(event => event.time >= windowStart);
}

function buildFeatures(now) {
  const eyeValues = samples
    .map(sample => sample.eyeOpenness)
    .filter(value => Number.isFinite(value));

  const averageEyeOpenness =
    eyeValues.length > 0
      ? eyeValues.reduce((sum, value) => sum + value, 0) / eyeValues.length
      : null;

  const blinkRate = blinkEvents.length * (60_000 / WINDOW_MS);

  const averageBlinkDuration =
    blinkEvents.length > 0
      ? blinkEvents.reduce((sum, event) => sum + event.duration, 0) /
        blinkEvents.length
      : null;

  return {
    eyeOpenness: averageEyeOpenness,
    blinkRate,
    blinkDuration: averageBlinkDuration,
  };
}

export function resetFeatureWindow() {
  samples = [];
  blinkEvents = [];
  blinkActive = false;
  blinkStartedAt = null;
}