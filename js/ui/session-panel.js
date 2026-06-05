export function renderSessionPanel(state) {
  return `
    <section class="session-panel">
      <div>
        <p class="eyebrow">Session</p>
        <h2 id="session-status">${formatSessionStatus(state.session.status)}</h2>
      </div>

      <div class="session-time">
        <span id="session-elapsed">${formatElapsed(state.session.elapsedMs)}</span>
        <small>elapsed</small>
      </div>

      <div class="session-actions">
        <button 
          id="start-session" 
          class="primary-button"
          ${state.camera.status !== "active" || state.session.status === "recording" ? "disabled" : ""}
        >
          Start Session
        </button>

        <button 
          id="stop-session" 
          class="secondary-button"
          ${state.session.status !== "recording" ? "disabled" : ""}
        >
          Stop
        </button>
      </div>
    </section>
  `;
}

export function formatElapsed(ms = 0) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function formatSessionStatus(status) {
  if (status === "idle") return "Ready";
  if (status === "recording") return "Recording";
  if (status === "complete") return "Complete";

  return status;
}