import { renderCameraPanel } from "./camera-panel.js";
import { renderSignalPanel } from "./signal-panel.js";
import { renderQualityPanel } from "./quality-panel.js";

export function renderApp(root, state, actions) {
  root.innerHTML = `
    <main class="app-shell">
      <header class="hero">
        <p class="eyebrow">${state.app.version} / ${state.app.stage}</p>
        <h1>${state.app.name}</h1>
        <p class="hero-subtitle">${state.app.description}</p>
      </header>

      <section class="section-stack">
        ${renderCameraPanel(state)}
        ${renderSignalPanel(state)}
        ${renderQualityPanel(state)}

        <div class="status-strip">
          Current system status: ${state.camera.status}
        </div>
      </section>
    </main>
  `;

  root.querySelector("#start-camera").addEventListener("click", actions.onStartCamera);
  root.querySelector("#reset-app").addEventListener("click", actions.onReset);
}