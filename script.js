const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture");
const saveBtn = document.getElementById("save");
const photo = document.getElementById("photo");
const preview = document.querySelector(".preview");

/*
  🔥🔥 AGGRESSIVE PIXEL SETTINGS 🔥🔥
*/
const INTERNAL_RES = 32;   // VERY blocky
const OUTPUT_RES = 768;   // clean upscale
const FPS = 15;           // stabilizes motion
const COLOR_LEVELS = 4;   // posterization strength

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

// Main render loop
function render(time) {
  if (time - lastFrame < 1000 / FPS) {
    requestAnimationFrame(render);
    return;
  }
  lastFrame = time;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, INTERNAL_RES, INTERNAL_RES);
  ctx.drawImage(video, 0, 0, INTERNAL_RES, INTERNAL_RES);

  posterize();

  requestAnimationFrame(render);
}

// Posterization (forces pixel look)
function posterize() {
  const img = ctx.getImageData(0, 0, INTERNAL_RES, INTERNAL_RES);
  const data = img.data;

  const step = 255 / (COLOR_LEVELS - 1);

  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.round(data[i] / step) * step;     // R
    data[i + 1] = Math.round(data[i + 1] / step) * step; // G
    data[i + 2] = Math.round(data[i + 2] / step) * step; // B
  }

  ctx.putImageData(img, 0, 0);
}

// Capture photo
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

// Save image (cross-device correct)
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
