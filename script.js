const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture");
const saveBtn = document.getElementById("save");
const photo = document.getElementById("photo");
const preview = document.querySelector(".preview");

/*
  🎞️ PEACEFUL CINEMATIC PIXEL SETTINGS
*/
const INTERNAL_RES = 200;   // 👈 slightly more pixelated
const OUTPUT_RES = 1600;   // clean export

canvas.width = INTERNAL_RES;
canvas.height = INTERNAL_RES;

let capturedData = null;

// Start camera
navigator.mediaDevices.getUserMedia({
  video: {
    width: 1920,
    height: 1080
  }
})
.then(stream => {
  video.srcObject = stream;
  video.play();
  requestAnimationFrame(render);
})
.catch(() => alert("Camera access denied"));

// Render loop with CENTER CROP (fixes oval issue)
function render() {
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    requestAnimationFrame(render);
    return;
  }

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  // Square crop from center
  const size = Math.min(vw, vh);
  const sx = (vw - size) / 2;
  const sy = (vh - size) / 2;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, INTERNAL_RES, INTERNAL_RES);

  ctx.drawImage(
    video,
    sx, sy, size, size,     // source crop (square)
    0, 0, INTERNAL_RES, INTERNAL_RES // destination
  );

  requestAnimationFrame(render);
}

// Capture photo
captureBtn.addEventListener("click", () => {
  const outCanvas = document.createElement("canvas");
  outCanvas.width = OUTPUT_RES;
  outCanvas.height = OUTPUT_RES;

  const outCtx = outCanvas.getContext("2d");
  outCtx.imageSmoothingEnabled = false;

  // Nearest-neighbor upscale
  outCtx.drawImage(canvas, 0, 0, OUTPUT_RES, OUTPUT_RES);

  capturedData = outCanvas.toDataURL("image/png");

  photo.src = capturedData;
  preview.classList.remove("hidden");
  saveBtn.disabled = false;
});

// Save image (works correctly everywhere)
saveBtn.addEventListener("click", async () => {
  if (!capturedData) return;

  // Mobile: share sheet
  if (navigator.share) {
    const blob = await (await fetch(capturedData)).blob();
    const file = new File([blob], "cinematic-pixel-photo.png", {
      type: "image/png"
    });
    navigator.share({ files: [file] });
    return;
  }

  // Desktop download
  const link = document.createElement("a");
  link.href = capturedData;
  link.download = "cinematic-pixel-photo.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
