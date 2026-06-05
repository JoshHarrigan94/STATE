import { store } from "./state/store.js";
import { renderApp } from "./ui/render.js";
import { createCameraController } from "./capture/camera.js";
import {
  detectFaceFromVideo,
  hasDetectedFace,
  loadFaceLandmarker,
} from "./vision/face-landmarker.js";
import { extractFaceSignals } from "./vision/face-signals.js";
import {
  resetFeatureWindow,
  updateFeatureWindow,
} from "./engine/feature-window.js";

const root = document.querySelector("#app");

let cameraController = null;
let animationFrameId = null;

function update() {
  renderApp(root, store, {
    onStartCamera: startSystem,
    onReset: resetSystem,
  });
}

async function startSystem() {
  const video = document.querySelector("#camera-feed");

  store.camera.status = "starting";
  store.camera.error = null;
  store.vision.status = "loading";
  store.vision.error = null;
  update();

  try {
    cameraController = createCameraController(video);
    await cameraController.start();

    store.camera.status = "active";
    update();

    await loadFaceLandmarker();

    store.vision.status = "active";
    update();

    startVisionLoop(video);
  } catch (error) {
    store.camera.status = "error";
    store.camera.error = error.message;
    store.vision.status = "error";
    store.vision.error = error.message;
    update();
  }
}

function startVisionLoop(video) {
  cancelVisionLoop();

  function loop() {
    const result = detectFaceFromVideo(video);

    if (result) {
      const faceDetected = hasDetectedFace(result);
      const rawSignals = extractFaceSignals(result);
      const features = updateFeatureWindow(rawSignals);

      store.vision.faceDetected = faceDetected;
      store.vision.faceCount = result.faceLandmarks?.length || 0;
      store.vision.framesProcessed += 1;

      if (rawSignals) {
        store.signals.leftEye = rawSignals.leftEye;
        store.signals.rightEye = rawSignals.rightEye;
      }

      store.signals.eyeOpenness = features.eyeOpenness;
      store.signals.blinkRate = features.blinkRate;
      store.signals.blinkDuration = features.blinkDuration;

      store.quality.signalQuality = faceDetected ? 45 : 0;
      store.quality.confidence = faceDetected ? 35 : 0;
    }

    update();
    animationFrameId = requestAnimationFrame(loop);
  }

  loop();
}

function cancelVisionLoop() {
  if (!animationFrameId) return;

  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
}

function resetSystem() {
  cancelVisionLoop();
  resetFeatureWindow();

  if (cameraController) {
    cameraController.stop();
    cameraController = null;
  }

  store.camera.status = "idle";
  store.camera.error = null;

  store.vision.status = "not-loaded";
  store.vision.error = null;
  store.vision.faceDetected = false;
  store.vision.faceCount = 0;
  store.vision.framesProcessed = 0;

  store.signals.eyeOpenness = null;
  store.signals.leftEye = null;
  store.signals.rightEye = null;
  store.signals.blinkRate = null;
  store.signals.blinkDuration = null;
  store.signals.headStability = null;
  store.signals.headTilt = null;
  store.signals.expressionVariability = null;

  store.quality.signalQuality = 0;
  store.quality.confidence = 0;

  update();
}

update();