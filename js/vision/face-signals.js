function distance(a, b) {
  if (!a || !b) return 0;

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function eyeAspectRatio(landmarks, indexes) {
  const [outer, inner, upper1, upper2, lower1, lower2] = indexes;

  const horizontal = distance(landmarks[outer], landmarks[inner]);

  const verticalA = distance(landmarks[upper1], landmarks[lower1]);
  const verticalB = distance(landmarks[upper2], landmarks[lower2]);

  if (!horizontal) return 0;

  return (verticalA + verticalB) / (2 * horizontal);
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

  return {
    eyeOpenness,
    leftEye,
    rightEye,
  };
}