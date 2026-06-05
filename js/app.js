import { store } from "./state/store.js";
import { renderApp, updateDynamicUI } from "./ui/render.js";
import { createCameraController } from "./capture/camera.js";
import {
  detectFaceFromVideo,
  hasDetectedFace,
  loadFaceLandmarker,
} from "./vision/face-landmarker.js";
import { extractFaceSignals } from "./vision/face-signals.js";
import { assessFaceQuality } from "./vision/face-quality.js";
import {
  resetFeatureWindow,
  updateFeatureWindow,
} from "./engine/feature-window.js";

const root = document.querySelector("#app");

let cameraController = null;
let animationFrameId = null;
let videoElement = null;

function fullRender() {
  renderApp(root, store, {
    onStartCamera: startSystem,
    onReset: resetSystem,
  });

  videoElement = document.querySelector("#camera-feed");
}

async function startSystem() {
  if (store.camera.status === "active" || store.camera.status === "starting") {
    return;
  }

  store.camera.status = "starting";
  store.camera.error = null;
  store.vision.status = "loading";
  store.vision.error = null;
  fullRender();

  try {
    cameraController = createCameraController(videoElement);
    await cameraController.start();

    store.camera.status = "active";
    updateDynamicUI(store);

    await loadFaceLandmarker();

    store.vision.status = "active";
    updateDynamicUI(store);

    startVisionLoop(videoElement);
  } catch (error) {
    store.camera.status = "error";
    store.camera.error = error.message;
    store.vision.status = "error";
    store.vision.error = error.message;
    fullRender();
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
      const quality = assessFaceQuality(result, rawSignals);

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
      store.signals.headStability = features.headStability;
      store.signals.headTilt = features.headTilt;
      store.signals.faceSize = features.faceSize;
      store.signals.expressionVariability = features.expressionVariability;

      store.quality.signalQuality = quality.signalQuality;
      store.quality.confidence = quality.confidence;
      store.quality.notes = quality.notes;

      updateDynamicUI(store);
    }

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
  store.signals.faceSize = null;
  store.signals.expressionVariability = null;

  store.quality.signalQuality = 0;
  store.quality.confidence = 0;
  store.quality.notes = [];

  fullRender();
}

fullRender();