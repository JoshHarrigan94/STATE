const BOOT_LOG = [];

function logBoot(type, message, detail = "") {
  BOOT_LOG.push({
    type,
    message,
    detail,
    time: new Date().toLocaleTimeString(),
  });

  renderBootPanel();
}

function renderBootPanel() {
  let panel = document.querySelector("#state-boot-panel");

  if (!panel) {
    panel = document.createElement("section");
    panel.id = "state-boot-panel";
    panel.className = "boot-panel";
    document.body.prepend(panel);
  }

  const hasErrors = BOOT_LOG.some(item => item.type === "error");

  panel.innerHTML = `
    <div class="boot-panel-header">
      <strong>${hasErrors ? "STATE Boot Issues" : "STATE Boot OK"}</strong>
      <button id="boot-panel-toggle">Toggle</button>
    </div>

    <div class="boot-panel-body">
      ${BOOT_LOG.map(item => `
        <article class="boot-log boot-${item.type}">
          <span>${item.time} · ${item.type}</span>
          <strong>${item.message}</strong>
          ${item.detail ? `<pre>${escapeHtml(item.detail)}</pre>` : ""}
        </article>
      `).join("")}
    </div>
  `;

  panel.querySelector("#boot-panel-toggle")?.addEventListener("click", () => {
    panel.classList.toggle("is-collapsed");
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

window.addEventListener("error", event => {
  logBoot(
    "error",
    event.message || "Runtime error",
    `${event.filename || ""}:${event.lineno || ""}:${event.colno || ""}`
  );
});

window.addEventListener("unhandledrejection", event => {
  logBoot(
    "error",
    "Unhandled promise rejection",
    event.reason?.stack || event.reason?.message || String(event.reason)
  );
});

async function checkRequiredFiles() {
  const files = [
    "./js/app.js",
    "./js/state/store.js",
    "./js/ui/render.js",
    "./js/ui/assessment-stage.js",
    "./js/ui/session-summary-panel.js",
    "./js/assessments/assessment-router.js",
    "./js/assessments/follow-dot.js",
    "./js/assessments/follow-dot-score.js",
    "./js/assessments/reaction-test.js",
    "./js/vision/face-landmarker.js",
    "./js/config/config.js",
  ];

  for (const file of files) {
    try {
      const response = await fetch(file, { cache: "no-store" });

      if (!response.ok) {
        logBoot("error", `Missing file: ${file}`, `HTTP ${response.status}`);
      } else {
        logBoot("ok", `Found ${file}`);
      }
    } catch (error) {
      logBoot("error", `Could not check ${file}`, error.message);
    }
  }
}

async function boot() {
  logBoot("ok", "Bootstrap started");

  const root = document.querySelector("#app");

  if (!root) {
    logBoot("error", "Missing #app root element", "Check index.html");
    return;
  }

  await checkRequiredFiles();

  try {
    await import("./app.js");
    logBoot("ok", "App module loaded");
  } catch (error) {
    logBoot(
      "error",
      "App module failed to load",
      error.stack || error.message || String(error)
    );
  }
}

boot();