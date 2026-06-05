export function renderQualityPanel(state) {
  const notes = state.quality.notes || [];

  return `
    <section class="diagnostic-panel">
      <div class="diagnostic-header">
        <div>
          <p class="eyebrow">Diagnostics</p>
          <h2>Signal Readiness</h2>
        </div>

        <div class="diagnostic-score">
          <span id="diagnostic-confidence">${Math.round(state.quality.confidence)}%</span>
          <small>confidence</small>
        </div>
      </div>

      <div class="quality-meter">
        <div 
          id="quality-meter-fill"
          class="quality-meter-fill" 
          style="width: ${Math.round(state.quality.signalQuality)}%"
        ></div>
      </div>

      <div class="diagnostic-grid">
        ${diagnosticItem("Camera", "diagnostic-camera", formatStatus(state.camera.status))}
        ${diagnosticItem("Vision", "diagnostic-vision", formatStatus(state.vision.status))}
        ${diagnosticItem("Face", "diagnostic-face", state.vision.faceDetected ? "Detected" : "Searching")}
        ${diagnosticItem("Frames", "diagnostic-frames", state.vision.framesProcessed)}
      </div>

      <div class="calibration-card">
        <p class="eyebrow">Calibration</p>

        <div class="calibration-row">
          <span>Rolling window</span>
          <strong id="calibration-window">${state.calibration.windowSeconds}s</strong>
        </div>

        <div class="calibration-row">
          <span>Smoothing alpha</span>
          <strong id="calibration-alpha">${state.calibration.smoothingAlpha}</strong>
        </div>

        <div class="calibration-row">
          <span>Samples in window</span>
          <strong id="calibration-samples">${state.calibration.sampleCount}</strong>
        </div>
      </div>

      <div class="quality-notes">
        <p class="eyebrow">Quality Notes</p>
        <div id="quality-notes-content">
          ${
            notes.length
              ? `
                <ul>
                  ${notes.map(note => `<li>${note}</li>`).join("")}
                </ul>
              `
              : `
                <p class="good-note">
                  Signal conditions are currently acceptable.
                </p>
              `
          }
        </div>
      </div>
    </section>
  `;
}

function diagnosticItem(label, id, value) {
  return `
    <article class="diagnostic-item">
      <span>${label}</span>
      <strong id="${id}">${value}</strong>
    </article>
  `;
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