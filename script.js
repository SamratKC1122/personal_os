const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture");
const flipBtn = document.getElementById("flip");
const downloadLink = document.getElementById("download");
const photo = document.getElementById("photo");

const pixelSize = 40;
canvas.width = pixelSize;
canvas.height = pixelSize;

let currentStream = null;
let cameras = [];
let currentCameraIndex = 0;

// Get available cameras
async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  cameras = devices.filter(d => d.kind === "videoinput");
}

// Start camera by deviceId
async function startCamera(deviceId = null) {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: deviceId
      ? { deviceId: { exact: deviceId } }
      : { facingMode: { ideal: "user" } }
  };

  currentStream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = currentStream;
  await video.play();
}

// Pixel draw loop
function draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(video, 0, 0, pixelSize, pixelSize);
  requestAnimationFrame(draw);
}

// Flip camera (REAL switching)
flipBtn.addEventListener("click", async () => {
  if (cameras.length <= 1) {
    alert("No secondary camera found");
    return;
  }

  currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
  await startCamera(cameras[currentCameraIndex].deviceId);
});

// Capture photo
captureBtn.addEventListener("click", () => {
  const saveCanvas = document.createElement("canvas");
  const saveCtx = saveCanvas.getContext("2d");

  saveCanvas.width = 400;
  saveCanvas.height = 400;

  saveCtx.imageSmoothingEnabled = false;
  saveCtx.drawImage(canvas, 0, 0, 400, 400);

  const dataURL = saveCanvas.toDataURL("image/png");
  photo.src = dataURL;
  downloadLink.href = dataURL;
  downloadLink.style.display = "inline-block";
});

// Init
(async function init() {
  await getCameras();
  await startCamera(cameras[0]?.deviceId);
  draw();
})();
