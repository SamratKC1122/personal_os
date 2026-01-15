const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const size = canvas.width;

let snake = [
  { x: 200, y: 200 },
  { x: 180, y: 200 },
  { x: 160, y: 200 }
];

let direction = "RIGHT";
let food = spawnFood();
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (size / box)) * box,
    y: Math.floor(Math.random() * (size / box)) * box
  };
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);

  // draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // draw snake
  ctx.fillStyle = "#0f0";
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, box, box);
  });

  // move snake
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // collision
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= size || head.y >= size ||
    snake.some(part => part.x === head.x && part.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    location.reload();
  }

  // eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

const game = setInterval(draw, 120);
