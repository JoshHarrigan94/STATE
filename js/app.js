import { generatePatternLabels } from "./engine/pattern-engine.js";
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
import {
  compareToBaseline,
  getBaselineProgress,
  resetBaselineEngine,
  updateBaselineEngine,
} from "./engine/baseline-engine.js";
import { config } from "./config/config.js";
import { resetSmoothing, smoothValue } from "./utils/smoothing.js";

const root = document.querySelector("#app");

let cameraController = null;
let animationFrameId = null;
let videoElement = null;

function fullRender() {
  renderApp(root, store, {
    onStartCamera: startSystem,
    onReset: resetSystem,
    onStartSession: startSession,
    onStopSession: stopSession,
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

function startSession() {
  if (store.camera.status !== "active") return;

  resetBaselineEngine();

  store.session.status = "recording";
  store.session.startedAt = performance.now();
  store.session.endedAt = null;
  store.session.elapsedMs = 0;
  store.session.samplesRecorded = 0;
  store.trace.points = [];

  store.baseline.progress = 0;
  store.baseline.complete = false;
  resetBaselineState();

  updateDynamicUI(store);
}

function stopSession() {
  if (store.session.status !== "recording") return;

  store.session.status = "complete";
  store.session.endedAt = performance.now();
  store.session.elapsedMs = store.session.endedAt - store.session.startedAt;

  updateDynamicUI(store);
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
        store.signals.leftEye = smoothValue(
          "leftEye",
          rawSignals.leftEye,
          config.smoothing.alpha
        );

        store.signals.rightEye = smoothValue(
          "rightEye",
          rawSignals.rightEye,
          config.smoothing.alpha
        );
      }

      store.signals.eyeOpenness = smoothValue(
        "eyeOpenness",
        features.eyeOpenness,
        config.smoothing.alpha
      );

      store.signals.blinkRate = features.blinkRate;

      store.signals.blinkDuration = smoothValue(
        "blinkDuration",
        features.blinkDuration,
        config.smoothing.alpha
      );

      store.signals.headStability = smoothValue(
        "headStability",
        features.headStability,
        config.smoothing.alpha
      );

      store.signals.headTilt = smoothValue(
        "headTilt",
        features.headTilt,
        config.smoothing.alpha
      );

      store.signals.faceSize = smoothValue(
        "faceSize",
        features.faceSize,
        config.smoothing.alpha
      );

      store.signals.expressionVariability = smoothValue(
        "expressionVariability",
        features.expressionVariability,
        config.smoothing.alpha
      );

      store.calibration.sampleCount = features.sampleCount;
      store.calibration.smoothingAlpha = config.smoothing.alpha;
      store.calibration.windowSeconds = config.features.windowMs / 1000;

      store.quality.signalQuality = smoothValue(
        "signalQuality",
        quality.signalQuality,
        config.smoothing.alpha
      );

      store.quality.confidence = smoothValue(
        "confidence",
        quality.confidence,
        config.smoothing.alpha
      );

      store.quality.notes = quality.notes;

      updateSessionTiming();
      updateBaseline();
            store.pattern = generatePatternLabels(store);
      if (store.session.status === "recording") {
        pushTracePoint();
        store.session.samplesRecorded += 1;
      }

      updateDynamicUI(store);
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  loop();
}

function updateSessionTiming() {
  if (store.session.status !== "recording") return;

  store.session.elapsedMs = performance.now() - store.session.startedAt;
}

function updateBaseline() {
  if (store.session.status !== "recording") return;

  const baseline = updateBaselineEngine(store.session, store.signals);

  store.baseline.progress = getBaselineProgress(store.session);

  if (baseline) {
    store.baseline.complete = store.baseline.progress >= 1;
    store.baseline.sampleCount = baseline.sampleCount;

    store.baseline.values.eyeOpenness = baseline.eyeOpenness;
    store.baseline.values.blinkRate = baseline.blinkRate;
    store.baseline.values.headStability = baseline.headStability;
    store.baseline.values.headTilt = baseline.headTilt;
    store.baseline.values.expressionVariability = baseline.expressionVariability;

    store.baseline.deltas = compareToBaseline(store.signals, store.baseline.values);
  }
}

function resetBaselineState() {
  store.baseline.values.eyeOpenness = null;
  store.baseline.values.blinkRate = null;
  store.baseline.values.headStability = null;
  store.baseline.values.headTilt = null;
  store.baseline.values.expressionVariability = null;

  store.baseline.deltas.eyeOpennessDelta = null;
  store.baseline.deltas.blinkRateDelta = null;
  store.baseline.deltas.headStabilityDelta = null;
  store.baseline.deltas.headTiltDelta = null;
  store.baseline.deltas.expressionVariabilityDelta = null;

  store.baseline.sampleCount = 0;
}

function resetPatternState() {
  store.pattern.status = "waiting";
  store.pattern.primaryLabel = "Waiting for baseline";
  store.pattern.summary =
    "Pattern labels will unlock after the neutral reference window is captured.";
  store.pattern.labels = [];
}

function pushTracePoint() {
  store.trace.points.push({
    time: performance.now(),
    eyeOpenness: store.signals.eyeOpenness,
    headStability: store.signals.headStability,
    expressionVariability: store.signals.expressionVariability,
  });

  if (store.trace.points.length > store.trace.maxPoints) {
    store.trace.points.shift();
  }
}

function cancelVisionLoop() {
  if (!animationFrameId) return;

  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
}

function resetSystem() {
  cancelVisionLoop();
  resetFeatureWindow();
  resetSmoothing();
  resetBaselineEngine();

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

  store.session.status = "idle";
  store.session.startedAt = null;
  store.session.endedAt = null;
  store.session.elapsedMs = 0;
  store.session.samplesRecorded = 0;

  store.signals.eyeOpenness = null;
  store.signals.leftEye = null;
  store.signals.rightEye = null;
  store.signals.blinkRate = null;
  store.signals.blinkDuration = null;
  store.signals.headStability = null;
  store.signals.headTilt = null;
  store.signals.faceSize = null;
  store.signals.expressionVariability = null;

  store.baseline.progress = 0;
  store.baseline.complete = false;
  resetBaselineState();
    resetPatternState();

  store.calibration.sampleCount = 0;
  store.calibration.smoothingAlpha = config.smoothing.alpha;
  store.calibration.windowSeconds = config.features.windowMs / 1000;

  store.quality.signalQuality = 0;
  store.quality.confidence = 0;
  store.quality.notes = [];

  store.trace.points = [];

  fullRender();
}

fullRender();