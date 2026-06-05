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

  quality: {
    signalQuality: 0,
    confidence: 0,
    notes: [],
  },
};