export function assessFaceQuality(result, rawSignals) {
  const hasFace = Boolean(result?.faceLandmarks?.[0]);

  if (!hasFace || !rawSignals) {
    return {
      faceVisible: false,
      signalQuality: 0,
      confidence: 0,
      notes: ["No face detected"],
    };
  }

  const notes = [];

  let quality = 40;

  if (rawSignals.eyeOpenness > 0.16) {
    quality += 15;
  } else {
    notes.push("Eyes may be partially occluded");
  }

  if (Math.abs(rawSignals.headTilt) < 0.18) {
    quality += 15;
  } else {
    notes.push("Head angle is high");
  }

  if (rawSignals.faceWidth > 0.22) {
    quality += 15;
  } else {
    notes.push("Face is too far from camera");
  }

  if (rawSignals.faceHeight > 0.22) {
    quality += 15;
  } else {
    notes.push("Face height is low");
  }

  const signalQuality = clamp(quality, 0, 100);

  return {
    faceVisible: true,
    signalQuality,
    confidence: Math.round(signalQuality * 0.82),
    notes,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}