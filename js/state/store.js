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

  signals: {
    eyeOpenness: null,
    blinkRate: null,
    blinkDuration: null,
    headStability: null,
    headTilt: null,
    expressionVariability: null,
  },

  quality: {
    signalQuality: 0,
    confidence: 0,
  },
};