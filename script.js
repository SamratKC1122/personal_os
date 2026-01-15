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
let facingMode = "user"; // front camera by default

// Start camera
async function startCamera() {
  // Stop previous stream
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode }
    });

    video.srcObject = currentStream;
    video.play();
    requestAnimationFrame(draw);
  } catch (err) {
    alert("Camera not available");
    console.error(err);
  }
}

// Draw pixelated video
function draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(video, 0, 0, pixelSize, pixelSize);
  requestAnimationFrame(draw);
}

// Flip camera
flipBtn.addEventListener("click", () => {
  facingMode = facingMode === "user" ? "environment" : "user";
  startCamera();
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

// Start on load
startCamera();
