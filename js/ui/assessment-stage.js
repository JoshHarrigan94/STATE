import { getAssessmentById } from "../assessments/assessment-store.js";
import { formatSignal } from "../utils/format.js";
import { formatElapsed } from "./session-panel.js";

export function renderAssessmentStage(state) {
  const assessment = getAssessmentById(state.assessment.activeId);

  if (!assessment) return "";

  return `
    <section class="assessment-stage">
      <div class="assessment-stage-header">
        <div>
          <p class="eyebrow">Active Test</p>
          <h2 id="assessment-title">${assessment.name}</h2>
        </div>

        <div class="assessment-timer">
          <span id="assessment-time">
            ${formatElapsed(state.assessment.elapsedMs)}
          </span>
          <small>${assessment.durationSec}s test</small>
        </div>
      </div>

      <p id="assessment-instructions" class="assessment-instructions">
        ${assessment.description}
      </p>

      <div 
        id="assessment-target" 
        class="assessment-target ${assessment.id === "follow-dot" ? "follow-dot-stage" : ""}"
      >
        ${renderAssessmentTarget(assessment.id, state)}
      </div>

      <div id="assessment-result" class="assessment-result">
        ${renderAssessmentResult(state)}
      </div>

      <div class="assessment-actions">
        <button
          id="start-assessment"
          class="primary-button"
          ${state.camera.status !== "active" || state.assessment.status === "running" ? "disabled" : ""}
        >
          Start Test
        </button>

        <button
          id="stop-assessment"
          class="secondary-button"
          ${state.assessment.status !== "running" ? "disabled" : ""}
        >
          Stop Test
        </button>
      </div>
    </section>
  `;
}

export function updateAssessmentStage(state) {
  if (state.assessment.activeId === "follow-dot") {
    updateFollowDotStage(state);
  }

  const result = document.querySelector("#assessment-result");
  if (result) {
    result.innerHTML = renderAssessmentResult(state);
  }
}

function updateFollowDotStage(state) {
  const dot = document.querySelector("#follow-dot-target");
  if (!dot) return;

  const result = state.assessment.result;

  if (!result || result.type !== "follow-dot") return;

  dot.style.left = `${result.dotX}%`;
  dot.style.top = `${result.dotY}%`;
}

function renderAssessmentTarget(id, state) {
  if (id === "follow-dot") {
    return `
      <div class="follow-dot-instructions">
        Keep your head still. Track the dot with your eyes.
      </div>

      <div
        id="follow-dot-target"
        class="follow-dot-target"
        style="left: 50%; top: 50%;"
      ></div>
    `;
  }

  return `
    <div class="assessment-target-placeholder">
      ${getPlaceholderText(id)}
    </div>
  `;
}

function renderAssessmentResult(state) {
  const result = state.assessment.result;

  if (!result || result.type !== "follow-dot") {
    return `
      <p class="assessment-result-placeholder">
        Assessment result will appear here.
      </p>
    `;
  }

  const score = result.score;

  if (!score?.ready) {
    return `
      <article class="assessment-score-card">
        <span>Follow The Dot</span>
        <strong>${score.label}</strong>
        <p>${score.detail}</p>
      </article>
    `;
  }

  return `
    <article class="assessment-score-card">
      <span>Follow The Dot Score</span>
      <strong>${Math.round(score.score)}%</strong>
      <p>${score.label}. ${score.detail}</p>

      <div class="assessment-metrics">
        ${metricItem(
          "Head Stability",
          formatSignal(score.metrics.averageHeadStability)
        )}
        ${metricItem(
          "Blink Rate",
          formatSignal(score.metrics.averageBlinkRate, "/min")
        )}
        ${metricItem(
          "Eye Openness",
          formatSignal(score.metrics.averageEyeOpenness)
        )}
        ${metricItem(
          "Expression",
          formatSignal(score.metrics.averageExpressionVariability)
        )}
      </div>
    </article>
  `;
}

function metricItem(label, value) {
  return `
    <div class="assessment-metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function getPlaceholderText(id) {
  if (id === "reaction-test") return "Reaction stimulus will render here.";
  if (id === "reading-focus") return "Reading passage will render here.";
  if (id === "stillness-test") return "Stillness target will render here.";

  return "Passive scan uses the camera and signal panels.";
}