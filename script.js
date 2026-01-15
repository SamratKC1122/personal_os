const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture");
const saveBtn = document.getElementById("save");
const photo = document.getElementById("photo");
const preview = document.querySelector(".preview");

const INTERNAL_RES = 160;
const OUTPUT_RES = 800;
const FPS = 24;

canvas.width = INTERNAL_RES;
canvas.height = INTERNAL_RES;

let lastFrame = 0;
let capturedData = null;

// Start camera
navigator.mediaDevices.getUserMedia({
  video: { width: 640, height: 640 }
})
.then(stream => {
  video.srcObject = stream;
  video.play();
  requestAnimationFrame(render);
})
.catch(() => alert("Camera access denied"));

function render(t) {
  if (t - lastFrame < 1000 / FPS) {
    requestAnimationFrame(render);
    return;
  }
  lastFrame = t;

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(video, 0, 0, INTERNAL_RES, INTERNAL_RES);
  ctx.imageSmoothingEnabled = false;

  requestAnimationFrame(render);
}

// Capture
captureBtn.addEventListener("click", () => {
  const out = document.createElement("canvas");
  out.width = OUTPUT_RES;
  out.height = OUTPUT_RES;

  const octx = out.getContext("2d");
  octx.imageSmoothingEnabled = false;
  octx.drawImage(canvas, 0, 0, OUTPUT_RES, OUTPUT_RES);

  capturedData = out.toDataURL("image/png");

  photo.src = capturedData;
  preview.classList.remove("hidden");
  saveBtn.disabled = false;
});

// Save (DESKTOP + MOBILE SAFE)
saveBtn.addEventListener("click", async () => {
  if (!capturedData) return;

  // Mobile-friendly share (iOS / Android)
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
