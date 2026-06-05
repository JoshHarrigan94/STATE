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
          <span>${Math.round(state.quality.confidence)}%</span>
          <small>confidence</small>
        </div>
      </div>

      <div class="quality-meter">
        <div 
          class="quality-meter-fill" 
          style="width: ${Math.round(state.quality.signalQuality)}%"
        ></div>
      </div>

      <div class="diagnostic-grid">
        ${diagnosticItem("Camera", formatStatus(state.camera.status))}
        ${diagnosticItem("Vision", formatStatus(state.vision.status))}
        ${diagnosticItem("Face", state.vision.faceDetected ? "Detected" : "Searching")}
        ${diagnosticItem("Frames", state.vision.framesProcessed)}
      </div>

      <div class="quality-notes">
        <p class="eyebrow">Quality Notes</p>
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
    </section>
  `;
}

function diagnosticItem(label, value) {
  return `
    <article class="diagnostic-item">
      <span>${label}</span>
      <strong>${value}</strong>
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