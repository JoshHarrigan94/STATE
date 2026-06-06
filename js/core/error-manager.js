window.STATE_DEBUG = window.STATE_DEBUG || {
  events: [],
  warnings: [],
  errors: [],
};

export function captureEvent(message, detail = "") {
  window.STATE_DEBUG.events.push(createLog("event", message, detail));
}

export function captureWarning(message, detail = "") {
  window.STATE_DEBUG.warnings.push(createLog("warning", message, detail));
  showErrorToast("Warning", message, detail);
}

export function captureError(message, detail = "") {
  window.STATE_DEBUG.errors.push(createLog("error", message, detail));
  showErrorToast("Something went wrong", message, detail);
}

export function showRecoveryScreen(message, detail = "") {
  document.body.innerHTML = `
    <main class="recovery-screen">
      <section class="recovery-card">
        <p class="eyebrow">STATE Recovery</p>
        <h1>Something prevented STATE from starting.</h1>

        <p>${message}</p>

        ${
          detail
            ? `
              <pre>${escapeHtml(detail)}</pre>
            `
            : ""
        }

        <div class="recovery-actions">
          <button id="reload-state" class="primary-button">
            Reload
          </button>

          <button id="copy-state-error" class="secondary-button">
            Copy Error
          </button>
        </div>
      </section>
    </main>
  `;

  document.querySelector("#reload-state")?.addEventListener("click", () => {
    window.location.reload();
  });

  document.querySelector("#copy-state-error")?.addEventListener("click", async () => {
    await navigator.clipboard?.writeText(`${message}\n\n${detail}`);
  });
}

function showErrorToast(title, message, detail = "") {
  let tray = document.querySelector("#state-error-tray");

  if (!tray) {
    tray = document.createElement("section");
    tray.id = "state-error-tray";
    tray.className = "error-tray";
    document.body.appendChild(tray);
  }

  const toast = document.createElement("article");
  toast.className = "error-toast";

  toast.innerHTML = `
    <button class="error-toast-close" type="button">×</button>
    <strong>${title}</strong>
    <span>${message}</span>
    ${
      detail
        ? `
          <details>
            <summary>Details</summary>
            <pre>${escapeHtml(detail)}</pre>
          </details>
        `
        : ""
    }
  `;

  toast.querySelector(".error-toast-close")?.addEventListener("click", () => {
    toast.remove();
  });

  tray.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 9000);
}

function createLog(type, message, detail) {
  return {
    type,
    message,
    detail,
    time: new Date().toISOString(),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
