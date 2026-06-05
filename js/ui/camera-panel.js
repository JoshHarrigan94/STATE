export function renderCameraPanel(state) {
  return `
    <section class="panel camera-panel">
      <div class="camera-frame">
        <div class="camera-placeholder">
          <strong>Camera inactive</strong>
          <span>Pass 2 will activate the live camera feed.</span>
        </div>
      </div>

      <div class="button-row">
        <button id="start-camera" class="primary-button">
          Start Camera
        </button>

        <button id="reset-app" class="secondary-button">
          Reset
        </button>
      </div>
    </section>
  `;
}