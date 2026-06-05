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
              <div id="camera-overlay" class="camera-overlay">
                <div class="camera-placeholder">
                  <strong>${getCameraTitle(state)}</strong>
                  <span>${getCameraMessage(state)}</span>
                </div>
              </div>
            `
            : ""
        }

        <div 
          id="face-status-pill"
          class="face-status-pill ${state.vision.faceDetected ? "is-detected" : ""}"
        >
          ${state.vision.faceDetected ? "Face detected" : "Searching for face"}
        </div>
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
          ${isStarting || isActive ? "disabled" : ""}
        >
          ${getButtonLabel(state)}
        </button>

        <button id="reset-app" class="secondary-button">
          Reset
        </button>
      </div>
    </section>
  `;
}

function getCameraTitle(state) {
  if (state.camera.status === "starting") return "Starting camera";
  if (state.camera.status === "error") return "Camera unavailable";
  return "Camera inactive";
}

function getCameraMessage(state) {
  if (state.camera.status === "starting") {
    if (state.vision.status === "loading") {
      return "Opening camera and preparing the face model.";
    }

    return "Requesting permission and opening the front camera.";
  }

  if (state.camera.status === "error") {
    return "Check browser permission, HTTPS, and GitHub Pages deployment.";
  }

  return "Press start to open the live preview.";
}

function getButtonLabel(state) {
  if (state.camera.status === "starting") return "Starting...";
  if (state.vision.status === "loading") return "Loading model...";
  if (state.camera.status === "active") return "Camera Active";
  return "Start Camera";
}