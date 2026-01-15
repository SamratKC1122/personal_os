const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// LOW resolution (controls block size)
const pixelWidth = 40;
const pixelHeight = 40;

canvas.width = pixelWidth;
canvas.height = pixelHeight;

// Access webcam
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

function draw() {
  // Draw video at very low resolution
  ctx.drawImage(video, 0, 0, pixelWidth, pixelHeight);

  // Scale it back up to create blocky effect
  ctx.imageSmoothingEnabled = false;

  requestAnimationFrame(draw);
}
