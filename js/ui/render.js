import { renderSessionSummaryPanel } from "./session-summary-panel.js";
import { renderAssessmentPanel } from "./assessment-panel.js";
import {
  renderAssessmentStage,
  updateAssessmentStage,
} from "./assessment-stage.js";
import { renderBaselinePanel } from "./baseline-panel.js";
import { renderCameraPanel } from "./camera-panel.js";
import { renderPatternList, renderPatternPanel } from "./pattern-panel.js";
import { renderSignalPanel } from "./signal-panel.js";
import { renderTracePanel, updateTracePanel } from "./trace-panel.js";
import { renderQualityPanel } from "./quality-panel.js";
import { renderSessionPanel, formatElapsed } from "./session-panel.js";
import {
  formatDelta,
  formatPercent,
  formatSignal,
} from "../utils/format.js";

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
        ${renderAssessmentPanel(state)}
        ${renderAssessmentStage(state)}
        ${renderSessionPanel(state)}
        ${renderSignalPanel(state)}
        ${renderBaselinePanel(state)}
        ${renderPatternPanel(state)}
        ${renderSessionSummaryPanel(state)}
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
  root.querySelector("#start-session").addEventListener("click", actions.onStartSession);
  root.querySelector("#stop-session").addEventListener("click", actions.onStopSession);
  root.querySelector("#start-assessment").addEventListener("click", actions.onStartAssessment);
  root.querySelector("#stop-assessment").addEventListener("click", actions.onStopAssessment);

  const reactionTarget = root.querySelector("#reaction-target");
if (reactionTarget) {
  reactionTarget.addEventListener("click", actions.onReactionTap);
}

  root.querySelectorAll("[data-assessment-id]").forEach(button => {
    button.addEventListener("click", () => {
      actions.onSelectAssessment(button.dataset.assessmentId);
    });
  });
}

export function updateDynamicUI(state) {
  updateText("#signal-eye-openness", formatSignal(state.signals.eyeOpenness));
  updateText("#signal-blink-rate", formatSignal(state.signals.blinkRate, "/min"));
  updateText(
  "#signal-blink-duration",
  formatSignal(state.signals.lastBlinkDuration, "ms")
);
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

  updateText("#session-status", formatSessionStatus(state.session.status));
  updateText("#session-elapsed", formatElapsed(state.session.elapsedMs));
  updateText(
  "#signal-blink-status",
  formatBlinkStatus(state.signals.blinkStatus)
);
  updateText("#assessment-time", formatElapsed(state.assessment.elapsedMs));
  updateAssessmentStage(state);
  updateBaselineUI(state);
  updatePatternUI(state);
  updateSummaryUI(state);
  updateActionButtons(state);

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

function updateSummaryUI(state) {
  updateText("#summary-title", state.summary.title);
  updateText("#summary-text", state.summary.summary);

  updateText(
    "#summary-confidence",
    state.summary.confidence
      ? `${Math.round(state.summary.confidence)}%`
      : "—"
  );
}

function updateActionButtons(state) {
  const startSessionButton = document.querySelector("#start-session");
  if (startSessionButton) {
    startSessionButton.disabled =
      state.camera.status !== "active" || state.session.status === "recording";
  }

  const stopSessionButton = document.querySelector("#stop-session");
  if (stopSessionButton) {
    stopSessionButton.disabled = state.session.status !== "recording";
  }

  const startAssessmentButton = document.querySelector("#start-assessment");
  if (startAssessmentButton) {
    startAssessmentButton.disabled =
      state.camera.status !== "active" ||
      state.assessment.status === "running";
  }

  const stopAssessmentButton = document.querySelector("#stop-assessment");
  if (stopAssessmentButton) {
    stopAssessmentButton.disabled =
      state.assessment.status !== "running";
  }
}

function updatePatternUI(state) {
  updateText("#pattern-primary", state.pattern.primaryLabel);
  updateText("#pattern-status", formatPatternStatus(state.pattern.status));
  updateText("#pattern-summary", state.pattern.summary);

  const list = document.querySelector("#pattern-list");
  if (list) {
    list.innerHTML = renderPatternList(state.pattern.labels);
  }
}

function updateBaselineUI(state) {
  updateText("#baseline-progress", `${Math.round(state.baseline.progress * 100)}%`);
  updateText("#baseline-eye", formatSignal(state.baseline.values.eyeOpenness));
  updateText("#baseline-blink", formatSignal(state.baseline.values.blinkRate, "/min"));
  updateText(
    "#baseline-head-stability",
    formatPercent(state.baseline.values.headStability)
  );
  updateText(
    "#baseline-expression",
    formatSignal(state.baseline.values.expressionVariability)
  );

  updateText(
    "#delta-eye",
    formatDelta(state.baseline.deltas.eyeOpennessDelta)
  );
  updateText(
    "#delta-blink",
    formatDelta(state.baseline.deltas.blinkRateDelta, "/min")
  );
  updateText(
    "#delta-head-stability",
    formatDelta(state.baseline.deltas.headStabilityDelta)
  );
  updateText(
    "#delta-expression",
    formatDelta(state.baseline.deltas.expressionVariabilityDelta)
  );

  const baselineMeter = document.querySelector("#baseline-meter-fill");
  if (baselineMeter) {
    baselineMeter.style.width = `${Math.round(state.baseline.progress * 100)}%`;
  }
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

function formatBlinkStatus(status) {
  if (status === "blink") return "Blink";
  if (status === "recent") return "Recent";
  if (status === "tracking") return "Tracking";
  return "Waiting";
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

function formatSessionStatus(status) {
  if (status === "idle") return "Ready";
  if (status === "recording") return "Recording";
  if (status === "complete") return "Complete";

  return status;
}

function formatPatternStatus(status) {
  if (status === "waiting") return "Waiting";
  if (status === "stable") return "Stable";
  if (status === "active") return "Active";

  return status;
}