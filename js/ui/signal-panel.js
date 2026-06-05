import { formatPercent, formatSignal } from "../utils/format.js";

export function renderSignalPanel(state) {
  return `
    <section class="signal-grid">
      ${signalCard("Eye Openness", formatSignal(state.signals.eyeOpenness))}
      ${signalCard("Blink Rate", formatSignal(state.signals.blinkRate, "/min"))}
      ${signalCard("Blink Duration", formatSignal(state.signals.blinkDuration, "ms"))}
      ${signalCard("Head Stability", formatPercent(state.signals.headStability))}
      ${signalCard("Head Tilt", formatSignal(state.signals.headTilt, " rad"))}
      ${signalCard("Face Size", formatSignal(state.signals.faceSize))}
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