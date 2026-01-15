const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture");
const saveBtn = document.getElementById("save");
const photo = document.getElementById("photo");
const preview = document.querySelector(".preview");

/*
  🎞️ CINEMATIC PIXEL SETTINGS (COLOR SAFE)
*/
const INTERNAL_RES = 240;   // 👈 key: keeps color & detail
const OUTPUT_RES = 1600;   // clean cinematic export

canvas.width = INTERNAL_RES;
canvas.height = INTERNAL_RES;

let capturedData = null;

// Start camera (HIGH QUALITY INPUT)
navigator.mediaDevices.getUserMedia({
  video: {
    width: 1920,
    height: 1920
  }
})
.then(stream => {
  video.srcObject = stream;
  video.play();
  requestAnimationFrame(render);
})
.catch(() => alert("Camera access denied"));

function render() {
  // Draw high-quality frame → gentle pixel grid
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, INTERNAL_RES, INTERNAL_RES);
  ctx.drawImage(video, 0, 0, INTERNAL_RES, INTERNAL_RES);

  requestAnimationFrame(render);
}

// Capture photo
captureBtn.addEventListener("click", () => {
  const outCanvas = document.createElement("canvas");
  outCanvas.width = OUTPUT_RES;
  outCanvas.height = OUTPUT_RES;

  const outCtx = outCanvas.getContext("2d");

  // IMPORTANT: nearest-neighbor upscale
  outCtx.imageSmoothingEnabled = false;
  outCtx.drawImage(canvas, 0, 0, OUTPUT_RES, OUTPUT_RES);

  capturedData = outCanvas.toDataURL("image/png");

  photo.src = capturedData;
  preview.classList.remove("hidden");
  saveBtn.disabled = false;
});

// Save image (correct behavior everywhere)
saveBtn.addEventListener("click", async () => {
  if (!capturedData) return;

  if (navigator.share) {
    const blob = await (await fetch(capturedData)).blob();
    const file = new File([blob], "cinematic-pixel-photo.png", {
      type: "image/png"
    });
    navigator.share({ files: [file] });
    return;
  }

  const link = document.createElement("a");
  link.href = capturedData;
  link.download = "cinematic-pixel-photo.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
