const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture");
const saveBtn = document.getElementById("save");
const photo = document.getElementById("photo");
const preview = document.querySelector(".preview");

/*
  🔥 PIXEL SETTINGS
  Lower INTERNAL_RES = more blocky
*/
const INTERNAL_RES = 64;    // main pixel strength
const OUTPUT_RES = 768;    // export resolution
const FPS = 20;            // motion stability

canvas.width = INTERNAL_RES;
canvas.height = INTERNAL_RES;

let lastFrame = 0;
let capturedData = null;

// Start camera
navigator.mediaDevices.getUserMedia({
  video: {
    width: 640,
    height: 640
  }
})
.then(stream => {
  video.srcObject = stream;
  video.play();
  requestAnimationFrame(render);
})
.catch(() => alert("Camera access denied"));

// Render loop (FPS capped + hard pixels)
function render(time) {
  if (time - lastFrame < 1000 / FPS) {
    requestAnimationFrame(render);
    return;
  }
  lastFrame = time;

  // IMPORTANT: disable smoothing BEFORE draw
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
  outCtx.imageSmoothingEnabled = false;

  // Scale up pixel image cleanly
  outCtx.drawImage(canvas, 0, 0, OUTPUT_RES, OUTPUT_RES);

  capturedData = outCanvas.toDataURL("image/png");

  // Show preview
  photo.src = capturedData;
  preview.classList.remove("hidden");
  saveBtn.disabled = false;
});

// Save image (desktop + mobile safe)
saveBtn.addEventListener("click", async () => {
  if (!capturedData) return;

  // Mobile (iOS / Android) — Share Sheet
  if (navigator.share) {
    const blob = await (await fetch(capturedData)).blob();
    const file = new File([blob], "pixel-photo.png", { type: "image/png" });
    navigator.share({ files: [file] });
    return;
  }

  // Desktop download
  const link = document.createElement("a");
  link.href = capturedData;
  link.download = "pixel-photo.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
