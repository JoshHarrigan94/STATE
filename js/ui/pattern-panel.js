export function renderPatternPanel(state) {
  const labels = state.pattern.labels || [];

  return `
    <section class="pattern-panel">
      <div class="pattern-header">
        <div>
          <p class="eyebrow">Pattern</p>
          <h2 id="pattern-primary">${state.pattern.primaryLabel}</h2>
        </div>

        <div class="pattern-status">
          <span id="pattern-status">${formatPatternStatus(state.pattern.status)}</span>
        </div>
      </div>

      <p id="pattern-summary" class="pattern-summary">
        ${state.pattern.summary}
      </p>

      <div id="pattern-list" class="pattern-list">
        ${renderPatternList(labels)}
      </div>
    </section>
  `;
}

export function renderPatternList(labels) {
  if (!labels?.length) {
    return `
      <article class="pattern-item">
        <span>Waiting</span>
        <strong>No pattern labels yet</strong>
        <small>Start a session and complete the baseline window.</small>
      </article>
    `;
  }

  return labels
    .map(
      item => `
        <article class="pattern-item">
          <span>${formatType(item.type)}</span>
          <strong>${item.label}</strong>
          <small>${item.detail}</small>
          <div class="pattern-strength">
            <div style="width: ${Math.round(item.strength * 100)}%"></div>
          </div>
        </article>
      `
    )
    .join("");
}

function formatPatternStatus(status) {
  if (status === "waiting") return "Waiting";
  if (status === "stable") return "Stable";
  if (status === "active") return "Active";

  return status;
}

function formatType(type) {
  if (type === "eye") return "Eye";
  if (type === "blink") return "Blink";
  if (type === "movement") return "Movement";
  if (type === "expression") return "Expression";
  if (type === "stable") return "Stable";

  return type;
}