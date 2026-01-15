const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("capture");
const photo = document.getElementById("photo");
const downloadLink = document.getElementById("download");

const pixelSize = 40;
canvas.width = pixelSize;
canvas.height = pixelSize;

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(draw);
  })
  .catch(() => alert("Camera access denied"));

// Draw live pixel video
function draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(video, 0, 0, pixelSize, pixelSize);
  requestAnimationFrame(draw);
}

// Capture photo
captureBtn.addEventListener("click", () => {
  const saveCanvas = document.createElement("canvas");
  const saveCtx = saveCanvas.getContext("2d");

  saveCanvas.width = 400;
  saveCanvas.height = 400;

  saveCtx.imageSmoothingEnabled = false;
  saveCtx.drawImage(canvas, 0, 0, 400, 400);

  const dataURL = saveCanvas.toDataURL("image/png");

  // Show preview
  photo.src = dataURL;

  // Enable manual save
  downloadLink.href = dataURL;
  downloadLink.style.display = "inline-block";
});
