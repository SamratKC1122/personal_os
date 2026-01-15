const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("capture");
const download = document.getElementById("download");
const photo = document.getElementById("photo");

/*
  Internal resolution:
  - Higher = better motion quality
  - Still pixelated when scaled
*/
const INTERNAL_RES = 120;
const OUTPUT_RES = 600;

canvas.width = INTERNAL_RES;
canvas.height = INTERNAL_RES;

let lastFrame = 0;
const FPS = 20;

// Start camera
navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 640 } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(render);
  })
  .catch(() => alert("Camera access denied"));

// Controlled render loop (FPS capped)
function render(timestamp) {
  if (timestamp - lastFrame < 1000 / FPS) {
    requestAnimationFrame(render);
    return;
  }
  lastFrame = timestamp;

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(video, 0, 0, INTERNAL_RES, INTERNAL_RES);
  ctx.imageSmoothingEnabled = false;

  requestAnimationFrame(render);
}

// Capture photo
captureBtn.addEventListener("click", () => {
  const out = document.createElement("canvas");
  out.width = OUTPUT_RES;
  out.height = OUTPUT_RES;

  const octx = out.getContext("2d");
  octx.imageSmoothingEnabled = false;
  octx.drawImage(canvas, 0, 0, OUTPUT_RES, OUTPUT_RES);

  const data = out.toDataURL("image/png");
  photo.src = data;
  download.href = data;
  download.style.display = "block";
});
