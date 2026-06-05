import { formatSignal } from "../utils/format.js";

export function renderSignalPanel(state) {
  return `
    <section class="signal-grid">
      ${signalCard("Eye Openness", formatSignal(state.signals.eyeOpenness))}
      ${signalCard("Blink Rate", formatSignal(state.signals.blinkRate, "/min"))}
      ${signalCard("Blink Duration", formatSignal(state.signals.blinkDuration, "ms"))}
      ${signalCard("Left Eye", formatSignal(state.signals.leftEye))}
      ${signalCard("Right Eye", formatSignal(state.signals.rightEye))}
      ${signalCard("Head Stability", formatSignal(state.signals.headStability))}
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