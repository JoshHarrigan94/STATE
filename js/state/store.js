export const store = {
  app: {
    name: "STATE",
    version: "V1",
    stage: "Face Signal Engine",
    description:
      "A static GitHub Pages prototype for extracting behavioural state signals from the face.",
  },

  camera: {
    status: "idle",
    error: null,
  },

  vision: {
    status: "not-loaded",
    error: null,
    faceDetected: false,
    faceCount: 0,
    framesProcessed: 0,
  },

  session: {
    status: "idle",
    startedAt: null,
    endedAt: null,
    elapsedMs: 0,
    samplesRecorded: 0,
  },

  signals: {
    eyeOpenness: null,
    leftEye: null,
    rightEye: null,
    blinkRate: null,
    blinkDuration: null,
    headStability: null,
    headTilt: null,
    faceSize: null,
    expressionVariability: null,
  },

  baseline: {
    progress: 0,
    complete: false,
    values: {
      eyeOpenness: null,
      blinkRate: null,
      headStability: null,
      headTilt: null,
      expressionVariability: null,
    },
    deltas: {
      eyeOpennessDelta: null,
      blinkRateDelta: null,
      headStabilityDelta: null,
      headTiltDelta: null,
      expressionVariabilityDelta: null,
    },
    sampleCount: 0,
  },

  calibration: {
    sampleCount: 0,
    smoothingAlpha: 0.22,
    windowSeconds: 10,
  },

  trace: {
    maxPoints: 160,
    points: [],
  },

  quality: {
    signalQuality: 0,
    confidence: 0,
    notes: [],
  },
};