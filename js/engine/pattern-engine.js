export function generatePatternLabels(state) {
  if (!state.baseline.complete) {
    return {
      status: "waiting",
      primaryLabel: "Waiting for baseline",
      summary: "Pattern labels will unlock after the neutral reference window is captured.",
      labels: [],
    };
  }

  const deltas = state.baseline.deltas;
  const labels = [];

  const eyeDelta = deltas.eyeOpennessDelta;
  const blinkDelta = deltas.blinkRateDelta;
  const headStabilityDelta = deltas.headStabilityDelta;
  const expressionDelta = deltas.expressionVariabilityDelta;

  if (Number.isFinite(eyeDelta)) {
    if (eyeDelta < -0.025) {
      labels.push({
        type: "eye",
        label: "Reduced eye openness",
        detail: "Eye openness is currently below the session baseline.",
        strength: Math.min(Math.abs(eyeDelta) / 0.08, 1),
      });
    }

    if (eyeDelta > 0.025) {
      labels.push({
        type: "eye",
        label: "Increased eye openness",
        detail: "Eye openness is currently above the session baseline.",
        strength: Math.min(Math.abs(eyeDelta) / 0.08, 1),
      });
    }
  }

  if (Number.isFinite(blinkDelta)) {
    if (blinkDelta > 6) {
      labels.push({
        type: "blink",
        label: "Higher blink activity",
        detail: "Blink rate is currently above the session baseline.",
        strength: Math.min(blinkDelta / 24, 1),
      });
    }

    if (blinkDelta < -6) {
      labels.push({
        type: "blink",
        label: "Lower blink activity",
        detail: "Blink rate is currently below the session baseline.",
        strength: Math.min(Math.abs(blinkDelta) / 24, 1),
      });
    }
  }

  if (Number.isFinite(headStabilityDelta)) {
    if (headStabilityDelta < -0.12) {
      labels.push({
        type: "movement",
        label: "Reduced head stability",
        detail: "Head movement is less stable than the session baseline.",
        strength: Math.min(Math.abs(headStabilityDelta) / 0.35, 1),
      });
    }

    if (headStabilityDelta > 0.12) {
      labels.push({
        type: "movement",
        label: "Increased head stability",
        detail: "Head movement is more stable than the session baseline.",
        strength: Math.min(Math.abs(headStabilityDelta) / 0.35, 1),
      });
    }
  }

  if (Number.isFinite(expressionDelta)) {
    if (expressionDelta > 0.006) {
      labels.push({
        type: "expression",
        label: "Higher facial movement",
        detail: "Expression variability is above the session baseline.",
        strength: Math.min(expressionDelta / 0.02, 1),
      });
    }

    if (expressionDelta < -0.006) {
      labels.push({
        type: "expression",
        label: "Lower facial movement",
        detail: "Expression variability is below the session baseline.",
        strength: Math.min(Math.abs(expressionDelta) / 0.02, 1),
      });
    }
  }

  if (!labels.length) {
    return {
      status: "stable",
      primaryLabel: "Stable signal pattern",
      summary: "Current signals are close to the captured baseline.",
      labels: [
        {
          type: "stable",
          label: "Stable",
          detail: "No major signal deviation from baseline detected.",
          strength: 0.2,
        },
      ],
    };
  }

  const strongest = [...labels].sort((a, b) => b.strength - a.strength)[0];

  return {
    status: "active",
    primaryLabel: strongest.label,
    summary: buildSummary(labels),
    labels: labels
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 4),
  };
}

function buildSummary(labels) {
  const topLabels = labels
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 2)
    .map(item => item.label.toLowerCase());

  if (topLabels.length === 1) {
    return `Current pattern is mainly showing ${topLabels[0]}.`;
  }

  return `Current pattern is mainly showing ${topLabels.join(" and ")}.`;
}