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
    </section>
  `;
}