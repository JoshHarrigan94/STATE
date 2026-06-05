import {
  captureError,
  captureEvent,
  showRecoveryScreen,
} from "./core/error-manager.js";

window.addEventListener("error", event => {
  captureError(
    event.message || "Runtime error",
    `${event.filename || ""}:${event.lineno || ""}:${event.colno || ""}`
  );
});

window.addEventListener("unhandledrejection", event => {
  captureError(
    "Unhandled promise rejection",
    event.reason?.stack || event.reason?.message || String(event.reason)
  );
});

async function boot() {
  captureEvent("Bootstrap started");

  const root = document.querySelector("#app");

  if (!root) {
    showRecoveryScreen(
      "Missing app root.",
      "index.html must contain <div id=\"app\"></div>."
    );
    return;
  }

  try {
    await import("./app.js");
    captureEvent("App module loaded");
  } catch (error) {
    showRecoveryScreen(
      "App module failed to load.",
      error.stack || error.message || String(error)
    );
  }
}

boot();