import { formatSignal } from "../utils/format.js";

export function renderSignalPanel(state) {
  return `
    <section class="signal-grid">
      ${signalCard("Eye Openness", formatSignal(state.signals.eyeOpenness))}
      ${signalCard("Blink Rate", formatSignal(state.signals.blinkRate, "/min"))}
      ${signalCard("Blink Duration", formatSignal(state.signals.blinkDuration, "ms"))}
      ${signalCard("Head Stability", formatSignal(state.signals.headStability))}
      ${signalCard("Head Tilt", formatSignal(state.signals.headTilt))}
      ${signalCard("Expression Variability", formatSignal(state.signals.expressionVariability))}
    </section>
  `;
}

function signalCard(label, value) {
  return `
    <article class="signal-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
}