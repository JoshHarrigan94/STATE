import { formatDelta, formatPercent, formatSignal } from "../utils/format.js";

export function renderBaselinePanel(state) {
  return `
    <section class="baseline-panel">
      <div class="baseline-header">
        <div>
          <p class="eyebrow">Baseline</p>
          <h2>${getBaselineTitle(state)}</h2>
        </div>

        <div class="baseline-score">
          <span id="baseline-progress">${Math.round(state.baseline.progress * 100)}%</span>
          <small>captured</small>
        </div>
      </div>

      <div class="baseline-meter">
        <div 
          id="baseline-meter-fill"
          class="baseline-meter-fill"
          style="width: ${Math.round(state.baseline.progress * 100)}%"
        ></div>
      </div>

      <div class="baseline-grid">
        ${baselineItem(
          "Eye Openness",
          "baseline-eye",
          formatSignal(state.baseline.values.eyeOpenness),
          "delta-eye",
          formatDelta(state.baseline.deltas.eyeOpennessDelta)
        )}

        ${baselineItem(
          "Blink Rate",
          "baseline-blink",
          formatSignal(state.baseline.values.blinkRate, "/min"),
          "delta-blink",
          formatDelta(state.baseline.deltas.blinkRateDelta, "/min")
        )}

        ${baselineItem(
          "Head Stability",
          "baseline-head-stability",
          formatPercent(state.baseline.values.headStability),
          "delta-head-stability",
          formatDelta(state.baseline.deltas.headStabilityDelta)
        )}

        ${baselineItem(
          "Expression Variability",
          "baseline-expression",
          formatSignal(state.baseline.values.expressionVariability),
          "delta-expression",
          formatDelta(state.baseline.deltas.expressionVariabilityDelta)
        )}
      </div>
    </section>
  `;
}

function baselineItem(label, valueId, value, deltaId, deltaValue) {
  return `
    <article class="baseline-item">
      <span>${label}</span>
      <strong id="${valueId}">${value}</strong>
      <small id="${deltaId}">${deltaValue}</small>
    </article>
  `;
}

function getBaselineTitle(state) {
  if (state.session.status === "idle") return "Waiting for session";
  if (state.session.status === "recording" && !state.baseline.complete) {
    return "Capturing neutral reference";
  }
  if (state.baseline.complete) return "Reference captured";

  return "Baseline ready";
}