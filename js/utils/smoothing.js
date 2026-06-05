const smoothedValues = {};

export function smoothValue(key, value, alpha = 0.22) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return value;
  }

  if (smoothedValues[key] === undefined) {
    smoothedValues[key] = value;
    return value;
  }

  smoothedValues[key] =
    alpha * value + (1 - alpha) * smoothedValues[key];

  return smoothedValues[key];
}

export function resetSmoothing() {
  Object.keys(smoothedValues).forEach(key => {
    delete smoothedValues[key];
  });
}