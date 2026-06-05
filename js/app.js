import { store } from "./state/store.js";
import { renderApp } from "./ui/render.js";
import { createCameraController } from "./capture/camera.js";

const root = document.querySelector("#app");

let cameraController = null;

function update() {
  renderApp(root, store, {
    onStartCamera: async () => {
      const video = document.querySelector("#camera-feed");

      store.camera.status = "starting";
      store.camera.error = null;
      update();

      try {
        cameraController = createCameraController(video);
        await cameraController.start();

        store.camera.status = "active";
        store.camera.error = null;
        update();
      } catch (error) {
        store.camera.status = "error";
        store.camera.error = error.message;
        update();
      }
    },

    onReset: () => {
      if (cameraController) {
        cameraController.stop();
        cameraController = null;
      }

      store.camera.status = "idle";
      store.camera.error = null;
      update();
    },
  });
}

update();