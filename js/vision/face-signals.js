function distance(a, b) {
  if (!a || !b) return 0;

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: ((a.z || 0) + (b.z || 0)) / 2,
  };
}

function eyeAspectRatio(landmarks, indexes) {
  const [outer, inner, upper1, upper2, lower1, lower2] = indexes;

  const horizontal = distance(landmarks[outer], landmarks[inner]);

  const verticalA = distance(landmarks[upper1], landmarks[lower1]);
  const verticalB = distance(landmarks[upper2], landmarks[lower2]);

  if (!horizontal) return 0;

  return (verticalA + verticalB) / (2 * horizontal);
}

function calculateHeadTilt(landmarks) {
  const leftEyeOuter = landmarks[33];
  const rightEyeOuter = landmarks[263];

  if (!leftEyeOuter || !rightEyeOuter) return 0;

  const dx = rightEyeOuter.x - leftEyeOuter.x;
  const dy = rightEyeOuter.y - leftEyeOuter.y;

  return Math.atan2(dy, dx);
}

function calculateFaceBounds(landmarks) {
  const xs = landmarks.map(point => point.x);
  const ys = landmarks.map(point => point.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    faceWidth: maxX - minX,
    faceHeight: maxY - minY,
  };
}

function calculateHeadCentre(landmarks) {
  const leftEye = midpoint(landmarks[33], landmarks[133]);
  const rightEye = midpoint(landmarks[362], landmarks[263]);

  return midpoint(leftEye, rightEye);
}

export function extractFaceSignals(result) {
  const landmarks = result?.faceLandmarks?.[0];

  if (!landmarks) {
    return null;
  }

  const leftEye = eyeAspectRatio(landmarks, [
    33, 133, 159, 158, 145, 153,
  ]);

  const rightEye = eyeAspectRatio(landmarks, [
    362, 263, 386, 385, 374, 380,
  ]);

  const eyeOpenness = (leftEye + rightEye) / 2;
  const headTilt = calculateHeadTilt(landmarks);
  const headCentre = calculateHeadCentre(landmarks);
  const bounds = calculateFaceBounds(landmarks);

  return {
    eyeOpenness,
    leftEye,
    rightEye,
    headTilt,
    headCentreX: headCentre.x,
    headCentreY: headCentre.y,
    faceWidth: bounds.faceWidth,
    faceHeight: bounds.faceHeight,
  };
}