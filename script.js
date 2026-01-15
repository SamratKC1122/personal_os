const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("capture");

// Low resolution for pixel effect
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
  .catch(err => {
    alert("Camera access denied");
    console.error(err);
  });

// Draw pixelated video
function draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(video, 0, 0, pixelSize, pixelSize);
  requestAnimationFrame(draw);
}

// Capture photo and save
captureBtn.addEventListener("click", () => {
  // Create a high-res canvas for saving
  const saveCanvas = document.createElement("canvas");
  const saveCtx = saveCanvas.getContext("2d");

  const outputSize = 400;
  saveCanvas.width = outputSize;
  saveCanvas.height = outputSize;

  saveCtx.imageSmoothingEnabled = false;
  saveCtx.drawImage(canvas, 0, 0, outputSize, outputSize);

  // Convert to image and download
  const link = document.createElement("a");
  link.download = `pixel-photo-${Date.now()}.png`;
  link.href = saveCanvas.toDataURL("image/png");
  link.click();
});
