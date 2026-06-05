import { formatPercent, formatSignal } from "../utils/format.js";

export function renderSignalPanel(state) {
  return `
    <section class="signal-grid">
      ${signalCard("Eye Openness", "signal-eye-openness", formatSignal(state.signals.eyeOpenness))}
      ${signalCard("Blink Rate", "signal-blink-rate", formatSignal(state.signals.blinkRate, "/min"))}
      ${signalCard("Blink Duration", "signal-blink-duration", formatSignal(state.signals.blinkDuration, "ms"))}
      ${signalCard("Head Stability", "signal-head-stability", formatPercent(state.signals.headStability))}
      ${signalCard("Head Tilt", "signal-head-tilt", formatSignal(state.signals.headTilt, " rad"))}
      ${signalCard("Expression Variability", "signal-expression-variability", formatSignal(state.signals.expressionVariability))}
    </section>
  `;
}

function signalCard(label, id, value) {
  return `
    <article class="signal-card">
      <span>${label}</span>
      <strong id="${id}">${value}</strong>
    </article>
  `;
}