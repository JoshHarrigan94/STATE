export function renderCameraPanel(state) {
  const isActive = state.camera.status === "active";
  const isStarting = state.camera.status === "starting";
  const hasError = state.camera.status === "error";

  return `
    <section class="panel camera-panel">
      <div class="camera-frame">
        <video
          id="camera-feed"
          class="camera-feed"
          playsinline
          muted
          autoplay
        ></video>

        ${
          !isActive
            ? `
              <div class="camera-overlay">
                <div class="camera-placeholder">
                  <strong>${getCameraTitle(state.camera.status)}</strong>
                  <span>${getCameraMessage(state.camera.status)}</span>
                </div>
              </div>
            `
            : ""
        }
      </div>

      ${
        hasError
          ? `
            <p class="error-message">
              ${state.camera.error}
            </p>
          `
          : ""
      }

      <div class="button-row">
        <button 
          id="start-camera" 
          class="primary-button"
          ${isStarting ? "disabled" : ""}
        >
          ${isStarting ? "Starting..." : "Start Camera"}
        </button>

        <button id="reset-app" class="secondary-button">
          Reset
        </button>
      </div>
    </section>
  `;
}

function getCameraTitle(status) {
  if (status === "starting") return "Starting camera";
  if (status === "error") return "Camera unavailable";
  return "Camera inactive";
}

function getCameraMessage(status) {
  if (status === "starting") {
    return "Requesting permission and opening the front camera.";
  }

  if (status === "error") {
    return "Check browser permission, HTTPS, and GitHub Pages deployment.";
  }

  return "Press start to open the live preview.";
}