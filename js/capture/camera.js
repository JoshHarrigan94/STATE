export function createCameraController(videoElement) {
  let stream = null;

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera access is not available in this browser.");
    }

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: {
          ideal: 640,
        },
        height: {
          ideal: 480,
        },
      },
      audio: false,
    });

    videoElement.srcObject = stream;

    await videoElement.play();

    return stream;
  }

  function stop() {
    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  function getStream() {
    return stream;
  }

  return {
    start,
    stop,
    getStream,
  };
}