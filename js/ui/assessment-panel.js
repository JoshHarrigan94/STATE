import { assessmentDefinitions } from "../assessments/assessment-store.js";

export function renderAssessmentPanel(state) {
  return `
    <section class="assessment-panel">
      <div class="assessment-header">
        <div>
          <p class="eyebrow">Assessments</p>
          <h2>Choose a State Test</h2>
        </div>
      </div>

      <div class="assessment-grid">
        ${assessmentDefinitions
          .map(assessment => renderAssessmentCard(assessment, state))
          .join("")}
      </div>
    </section>
  `;
}

function renderAssessmentCard(assessment, state) {
  const isActive = state.assessment.activeId === assessment.id;

  return `
    <button
      class="assessment-card ${isActive ? "is-active" : ""}"
      data-assessment-id="${assessment.id}"
      type="button"
    >
      <span>${assessment.category}</span>
      <strong>${assessment.name}</strong>
      <small>${assessment.durationSec}s</small>
      <p>${assessment.description}</p>
    </button>
  `;
}