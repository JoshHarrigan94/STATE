const DOT_RADIUS = 12;

let dot = {
  x: 50,
  y: 50,
  phase: 0,
};

export function updateFollowDot(store) {
  if (
    store.assessment.activeId !== "follow-dot" ||
    store.assessment.status !== "running"
  ) {
    return;
  }

  const elapsed = store.assessment.elapsedMs / 1000;

  dot.phase = elapsed;

  dot.x = 50 + Math.sin(elapsed * 0.9) * 34;
  dot.y = 50 + Math.cos(elapsed * 1.25) * 28;

  store.assessment.result = {
    type: "follow-dot",
    dotX: dot.x,
    dotY: dot.y,
    targetRadius: DOT_RADIUS,
    instruction: "Follow the dot with your eyes. Keep your head as still as possible.",
  };
}

export function resetFollowDot() {
  dot = {
    x: 50,
    y: 50,
    phase: 0,
  };
}