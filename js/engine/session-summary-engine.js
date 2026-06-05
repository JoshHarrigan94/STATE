export function buildSessionSummary(state) {
  const patterns = state.pattern.labels || [];

  if (!state.baseline.complete) {
    return {
      ready: false,
      title: "Baseline incomplete",
      summary:
        "A neutral reference has not yet been fully captured.",
      confidence: null,
    };
  }

  if (!patterns.length) {
    return {
      ready: true,
      title: "Stable signal profile",
      summary:
        "Current signals remain close to the captured baseline.",
      confidence: state.quality.confidence,
    };
  }

  const strongest = patterns[0];

  return {
    ready: true,
    title: strongest.label,
    summary: generateNarrative(patterns),
    confidence: state.quality.confidence,
  };
}

function generateNarrative(patterns) {
  const names = patterns
    .slice(0, 3)
    .map(item => item.label.toLowerCase());

  if (names.length === 1) {
    return `The strongest signal change observed during this session was ${names[0]}.`;
  }

  if (names.length === 2) {
    return `The strongest changes observed were ${names[0]} and ${names[1]}.`;
  }

  return `The strongest changes observed were ${names[0]}, ${names[1]} and ${names[2]}.`;
}