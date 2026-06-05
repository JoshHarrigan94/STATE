const MIN_WAIT_MS = 1200;
const MAX_WAIT_MS = 4200;
const TARGET_TRIALS = 5;

let reactionState = createInitialState();

export function startReactionTest(store) {
  if (store.assessment.activeId !== "reaction-test") return;

  reactionState = createInitialState();
  scheduleNextTrial();

  store.assessment.result = buildReactionResult();
}

export function updateReactionTest(store) {
  if (
    store.assessment.activeId !== "reaction-test" ||
    store.assessment.status !== "running"
  ) {
    return;
  }

  const now = performance.now();

  if (
    reactionState.phase === "waiting" &&
    reactionState.stimulusAt &&
    now >= reactionState.stimulusAt
  ) {
    reactionState.phase = "go";
    reactionState.goShownAt = now;
  }

  if (reactionState.completedTrials >= TARGET_TRIALS) {
    store.assessment.status = "complete";
    store.assessment.endedAt = now;
    store.assessment.elapsedMs =
      store.assessment.endedAt - store.assessment.startedAt;
    reactionState.phase = "complete";
  }

  store.assessment.result = buildReactionResult();
}

export function handleReactionTap(store) {
  if (
    store.assessment.activeId !== "reaction-test" ||
    store.assessment.status !== "running"
  ) {
    return;
  }

  const now = performance.now();

  if (reactionState.phase === "waiting") {
    reactionState.falseStarts += 1;
    reactionState.phase = "false-start";
    reactionState.message = "Too early. Wait for the stimulus.";

    window.setTimeout(() => {
      if (reactionState.phase === "false-start") {
        scheduleNextTrial();
      }
    }, 850);

    store.assessment.result = buildReactionResult();
    return;
  }

  if (reactionState.phase === "go") {
    const reactionTime = now - reactionState.goShownAt;

    reactionState.trials.push({
      reactionTime,
      time: now,
    });

    reactionState.completedTrials += 1;
    reactionState.phase = "registered";
    reactionState.message = `${Math.round(reactionTime)}ms`;

    window.setTimeout(() => {
      if (reactionState.completedTrials < TARGET_TRIALS) {
        scheduleNextTrial();
      } else {
        reactionState.phase = "complete";
      }
    }, 650);

    store.assessment.result = buildReactionResult();
  }
}

export function resetReactionTest() {
  reactionState = createInitialState();
}

function scheduleNextTrial() {
  const delay =
    MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS);

  reactionState.phase = "waiting";
  reactionState.stimulusAt = performance.now() + delay;
  reactionState.goShownAt = null;
  reactionState.message = "Wait for it...";
}

function buildReactionResult() {
  const averageReactionTime = averageReactionTimeMs();
  const consistency = reactionConsistency();

  return {
    type: "reaction-test",
    phase: reactionState.phase,
    message: reactionState.message,
    completedTrials: reactionState.completedTrials,
    targetTrials: TARGET_TRIALS,
    falseStarts: reactionState.falseStarts,
    averageReactionTime,
    consistency,
    score: buildScore(averageReactionTime, consistency, reactionState.falseStarts),
  };
}

function buildScore(averageReactionTime, consistency, falseStarts) {
  if (!Number.isFinite(averageReactionTime)) {
    return {
      ready: false,
      score: null,
      label: "Collecting reactions",
      detail: "Complete the reaction trials to generate a score.",
    };
  }

  const speedScore = clamp(1 - (averageReactionTime - 180) / 420, 0, 1);
  const consistencyScore = Number.isFinite(consistency)
    ? clamp(1 - consistency / 180, 0, 1)
    : 0.5;

  const falseStartPenalty = clamp(falseStarts * 0.12, 0, 0.35);

  const score = clamp(
    (speedScore * 0.65 + consistencyScore * 0.35 - falseStartPenalty) * 100,
    0,
    100
  );

  return {
    ready: true,
    score,
    label: getScoreLabel(score),
    detail: buildScoreDetail(score),
  };
}

function averageReactionTimeMs() {
  if (!reactionState.trials.length) return null;

  return (
    reactionState.trials.reduce(
      (sum, trial) => sum + trial.reactionTime,
      0
    ) / reactionState.trials.length
  );
}

function reactionConsistency() {
  if (reactionState.trials.length < 2) return null;

  const avg = averageReactionTimeMs();

  const variance =
    reactionState.trials.reduce(
      (sum, trial) => sum + (trial.reactionTime - avg) ** 2,
      0
    ) / reactionState.trials.length;

  return Math.sqrt(variance);
}

function getScoreLabel(score) {
  if (score >= 82) return "Fast and consistent";
  if (score >= 65) return "Responsive";
  if (score >= 45) return "Variable response";

  return "Slow or inconsistent";
}

function buildScoreDetail(score) {
  if (score >= 82) {
    return "Reaction times were fast with strong consistency.";
  }

  if (score >= 65) {
    return "Reaction speed was usable with moderate consistency.";
  }

  if (score >= 45) {
    return "Reaction timing showed noticeable variability.";
  }

  return "Reaction timing was slow or inconsistent during this test.";
}

function createInitialState() {
  return {
    phase: "idle",
    stimulusAt: null,
    goShownAt: null,
    completedTrials: 0,
    targetTrials: TARGET_TRIALS,
    falseStarts: 0,
    trials: [],
    message: "Press start to begin.",
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}