const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture");
const saveBtn = document.getElementById("save");
const photo = document.getElementById("photo");
const preview = document.querySelector(".preview");

/*
  🎥 CINEMATIC PIXEL SETTINGS
*/
const INTERNAL_RES = 72;    // balanced pixel size
const OUTPUT_RES = 1024;   // clean cinematic export
const FPS = 20;            // stable motion

canvas.width = INTERNAL_RES;
canvas.height = INTERNAL_RES;

let lastFrame = 0;
let capturedData = null;

// Start camera
navigator.mediaDevices.getUserMedia({
  video: {
    width: 1280,
    height: 1280
  }
})
.then(stream => {
  video.srcObject = stream;
  video.play();
  requestAnimationFrame(render);
})
.catch(() => alert("Camera access denied"));

// Render loop (pixelated but readable)
function render(time) {
  if (time - lastFrame < 1000 / FPS) {
    requestAnimationFrame(render);
    return;
  }
  lastFrame = time;

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

  // Clean upscale
  outCtx.drawImage(canvas, 0, 0, OUTPUT_RES, OUTPUT_RES);

  capturedData = outCanvas.toDataURL("image/png");

  photo.src = capturedData;
  preview.classList.remove("hidden");
  saveBtn.disabled = false;
});

// Save image (cross-device safe)
saveBtn.addEventListener("click", async () => {
  if (!capturedData) return;

  // Mobile: Share Sheet
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
