import { renderCameraPanel } from "./camera-panel.js";
import { renderSignalPanel } from "./signal-panel.js";
import { renderQualityPanel } from "./quality-panel.js";
import { renderTracePanel, updateTracePanel } from "./trace-panel.js";
import { formatPercent, formatSignal } from "../utils/format.js";

export function renderApp(root, state, actions) {
  root.innerHTML = `
    <main class="app-shell">
      <header class="hero">
        <p class="eyebrow">${state.app.version} / ${state.app.stage}</p>
        <h1>${state.app.name}</h1>
        <p class="hero-subtitle">${state.app.description}</p>
      </header>

      <section class="section-stack">
        ${renderCameraPanel(state)}
        ${renderSignalPanel(state)}
        ${renderTracePanel(state)}
        ${renderQualityPanel(state)}

        <div class="status-strip" id="status-strip">
          Current system status: ${state.camera.status}
        </div>
      </section>
    </main>
  `;

  root.querySelector("#start-camera").addEventListener("click", actions.onStartCamera);
  root.querySelector("#reset-app").addEventListener("click", actions.onReset);
}

export function updateDynamicUI(state) {
  updateText("#signal-eye-openness", formatSignal(state.signals.eyeOpenness));
  updateText("#signal-blink-rate", formatSignal(state.signals.blinkRate, "/min"));
  updateText("#signal-blink-duration", formatSignal(state.signals.blinkDuration, "ms"));
  updateText("#signal-head-stability", formatPercent(state.signals.headStability));
  updateText("#signal-head-tilt", formatSignal(state.signals.headTilt, " rad"));
  updateText(
    "#signal-expression-variability",
    formatSignal(state.signals.expressionVariability)
  );

  updateText("#diagnostic-confidence", `${Math.round(state.quality.confidence)}%`);
  updateText("#diagnostic-camera", formatStatus(state.camera.status));
  updateText("#diagnostic-vision", formatStatus(state.vision.status));
  updateText("#diagnostic-face", state.vision.faceDetected ? "Detected" : "Searching");
  updateText("#diagnostic-frames", state.vision.framesProcessed);
  updateText("#status-strip", `Current system status: ${state.camera.status}`);

  const meter = document.querySelector("#quality-meter-fill");
  if (meter) {
    meter.style.width = `${Math.round(state.quality.signalQuality)}%`;
  }

  const pill = document.querySelector("#face-status-pill");
  if (pill) {
    pill.textContent = state.vision.faceDetected ? "Face detected" : "Searching for face";
    pill.classList.toggle("is-detected", state.vision.faceDetected);
  }

  const overlay = document.querySelector("#camera-overlay");
  if (overlay && state.camera.status === "active") {
    overlay.remove();
  }

  updateText("#calibration-window", `${state.calibration.windowSeconds}s`);
  updateText("#calibration-alpha", state.calibration.smoothingAlpha);
  updateText("#calibration-samples", state.calibration.sampleCount);

  updateQualityNotes(state);
  updateTracePanel(state);
}

function updateQualityNotes(state) {
  const target = document.querySelector("#quality-notes-content");
  if (!target) return;

  const notes = state.quality.notes || [];

  target.innerHTML = notes.length
    ? `
      <ul>
        ${notes.map(note => `<li>${note}</li>`).join("")}
      </ul>
    `
    : `
      <p class="good-note">
        Signal conditions are currently acceptable.
      </p>
    `;
}

function updateText(selector, value) {
  const element = document.querySelector(selector);
  if (!element) return;

  element.textContent = value;
}

function formatStatus(status) {
  if (status === "not-loaded") return "Not loaded";
  if (status === "idle") return "Idle";
  if (status === "starting") return "Starting";
  if (status === "loading") return "Loading";
  if (status === "active") return "Active";
  if (status === "error") return "Error";

  return status;
}