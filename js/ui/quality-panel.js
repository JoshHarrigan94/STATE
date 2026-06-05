export function renderQualityPanel(state) {
  return `
    <section class="quality-panel">
      <article class="quality-card">
        <p class="eyebrow">Signal Quality</p>
        <strong>${Math.round(state.quality.signalQuality)}%</strong>
      </article>

      <article class="quality-card">
        <p class="eyebrow">Confidence</p>
        <strong>${Math.round(state.quality.confidence)}%</strong>
      </article>

      <article class="quality-card wide-card">
        <p class="eyebrow">Vision Engine</p>
        <strong>${formatVisionStatus(state.vision.status)}</strong>
        <span class="quality-meta">
          Faces: ${state.vision.faceCount} · Frames: ${state.vision.framesProcessed}
        </span>
      </article>
    </section>
  `;
}

function formatVisionStatus(status) {
  if (status === "not-loaded") return "Not Loaded";
  if (status === "loading") return "Loading";
  if (status === "active") return "Active";
  if (status === "error") return "Error";

  return status;
}