import { store } from "./state/store.js";
import { renderApp } from "./ui/render.js";

const root = document.querySelector("#app");

function update() {
  renderApp(root, store, {
    onStartCamera: () => {
      store.camera.status = "ready-for-pass-2";
      update();
    },

    onReset: () => {
      store.camera.status = "idle";
      update();
    },
  });
}

update();