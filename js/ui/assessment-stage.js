import { getAssessmentById } from "../assessments/assessment-store.js";
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
  if (state.assessment.activeId !== "follow-dot") return;

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

function getPlaceholderText(id) {
  if (id === "reaction-test") return "Reaction stimulus will render here.";
  if (id === "reading-focus") return "Reading passage will render here.";
  if (id === "stillness-test") return "Stillness target will render here.";

  return "Passive scan uses the camera and signal panels.";
}