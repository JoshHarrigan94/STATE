export const config = {
  mediapipe: {
    tasksVisionUrl:
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304",
    wasmPath:
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm",
    faceLandmarkerModel:
      "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
  },

  vision: {
    runningMode: "VIDEO",
    numFaces: 1,
    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  },

  features: {
    windowMs: 10_000,
    minSamplesForStability: 4,
  },

  blink: {
    threshold: 0.2,
    exitThreshold: 0.24,
    minDurationMs: 40,
    maxDurationMs: 600,
  },

  smoothing: {
    alpha: 0.22,
  },

  calibration: {
    eyeOpennessLow: 0.16,
    maxComfortableHeadTiltRad: 0.18,
    minFaceWidth: 0.22,
    minFaceHeight: 0.22,
  },
};