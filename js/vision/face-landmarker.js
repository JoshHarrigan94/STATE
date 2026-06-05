import { config } from "../config/config.js";

let faceLandmarker = null;
let lastVideoTime = -1;

export async function loadFaceLandmarker() {
  if (faceLandmarker) return faceLandmarker;

  const visionModule = await import(
    `${config.mediapipe.tasksVisionUrl}/vision_bundle.js`
  );

  const { FilesetResolver, FaceLandmarker } = visionModule;

  const filesetResolver = await FilesetResolver.forVisionTasks(
    config.mediapipe.wasmPath
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: config.mediapipe.faceLandmarkerModel,
      delegate: "GPU",
    },
    runningMode: config.vision.runningMode,
    numFaces: config.vision.numFaces,
    minFaceDetectionConfidence: config.vision.minFaceDetectionConfidence,
    minFacePresenceConfidence: config.vision.minFacePresenceConfidence,
    minTrackingConfidence: config.vision.minTrackingConfidence,
    outputFaceBlendshapes: true,
    outputFacialTransformationMatrixes: true,
  });

  return faceLandmarker;
}

export function detectFaceFromVideo(videoElement) {
  if (!faceLandmarker) {
    return null;
  }

  if (!videoElement || videoElement.readyState < 2) {
    return null;
  }

  if (videoElement.currentTime === lastVideoTime) {
    return null;
  }

  lastVideoTime = videoElement.currentTime;

  const timestampMs = performance.now();

  return faceLandmarker.detectForVideo(videoElement, timestampMs);
}

export function hasDetectedFace(result) {
  return Boolean(result?.faceLandmarks?.length);
}