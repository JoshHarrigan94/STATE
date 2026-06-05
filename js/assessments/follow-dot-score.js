let samples = [];

export function recordFollowDotSample(store) {
  if (
    store.assessment.activeId !== "follow-dot" ||
    store.assessment.status !== "running"
  ) {
    return;
  }

  samples.push({
    time: performance.now(),
    headStability: store.signals.headStability,
    blinkRate: store.signals.blinkRate,
    eyeOpenness: store.signals.eyeOpenness,
    expressionVariability: store.signals.expressionVariability,
  });
}

export function buildFollowDotScore() {
  const validSamples = samples.filter(sample =>
    Number.isFinite(sample.headStability)
  );

  if (validSamples.length < 10) {
    return {
      ready: false,
      score: null,
      label: "Collecting signal",
      detail: "Follow the dot while STATE gathers enough samples.",
      metrics: {
        averageHeadStability: null,
        averageBlinkRate: null,
        averageEyeOpenness: null,
        averageExpressionVariability: null,
      },
    };
  }

  const averageHeadStability = average("headStability");
  const averageBlinkRate = average("blinkRate");
  const averageEyeOpenness = average("eyeOpenness");
  const averageExpressionVariability = average("expressionVariability");

  const headScore = clamp(averageHeadStability, 0, 1);
  const blinkPenalty = clamp((averageBlinkRate - 18) / 30, 0, 1) * 0.25;
  const expressionPenalty =
    clamp(averageExpressionVariability / 0.025, 0, 1) * 0.15;

  const score = clamp(
    (headScore - blinkPenalty - expressionPenalty) * 100,
    0,
    100
  );

  return {
    ready: true,
    score,
    label: getScoreLabel(score),
    detail: buildScoreDetail(score),
    metrics: {
      averageHeadStability,
      averageBlinkRate,
      averageEyeOpenness,
      averageExpressionVariability,
    },
  };
}

export function resetFollowDotScore() {
  samples = [];
}

function average(key) {
  const values = samples
    .map(sample => sample[key])
    .filter(value => Number.isFinite(value));

  if (!values.length) return null;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getScoreLabel(score) {
  if (score >= 82) return "Strong visual control";
  if (score >= 65) return "Moderate visual control";
  if (score >= 45) return "Variable visual control";

  return "Low visual control";
}

function buildScoreDetail(score) {
  if (score >= 82) {
    return "Head stability remained strong while following the visual target.";
  }

  if (score >= 65) {
    return "Tracking was usable, with some movement or blink disruption.";
  }

  if (score >= 45) {
    return "Tracking showed noticeable variability during the task.";
  }

  return "Tracking signal was unstable during the task.";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}