const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("capture");
const photo = document.getElementById("photo");

// Pixel resolution
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

// Capture photo
captureBtn.addEventListener("click", () => {
  const saveCanvas = document.createElement("canvas");
  const saveCtx = saveCanvas.getContext("2d");

  const outputSize = 400;
  saveCanvas.width = outputSize;
  saveCanvas.height = outputSize;

  saveCtx.imageSmoothingEnabled = false;
  saveCtx.drawImage(canvas, 0, 0, outputSize, outputSize);

  // Show preview on page
  const imageData = saveCanvas.toDataURL("image/png");
  photo.src = imageData;

  // Download image
  const link = document.createElement("a");
  link.href = imageData;
  link.download = `pixel-photo-${Date.now()}.png`;
  link.click();
});
