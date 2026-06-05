export function renderSessionSummaryPanel(state) {
  return `
    <section class="summary-panel">
      <div class="summary-header">
        <div>
          <p class="eyebrow">Scan Result</p>
          <h2 id="summary-title">
            ${state.summary.title}
          </h2>
        </div>

        <div class="summary-confidence">
          <span id="summary-confidence">
            ${
              state.summary.confidence
                ? `${Math.round(state.summary.confidence)}%`
                : "—"
            }
          </span>

          <small>confidence</small>
        </div>
      </div>

      <p
        id="summary-text"
        class="summary-text"
      >
        ${state.summary.summary}
      </p>
    </section>
  `;
}
