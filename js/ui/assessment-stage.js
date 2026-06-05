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

      <div id="assessment-target" class="assessment-target">
        <div class="assessment-target-placeholder">
          ${getPlaceholderText(assessment.id)}
        </div>
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

function getPlaceholderText(id) {
  if (id === "follow-dot") return "Follow the dot test will render here.";
  if (id === "reaction-test") return "Reaction stimulus will render here.";
  if (id === "reading-focus") return "Reading passage will render here.";
  if (id === "stillness-test") return "Stillness target will render here.";

  return "Passive scan uses the camera and signal panels.";
}