var nextMovement = direction = [0, 1];
var x = y = 250;
var ctx;
var turns = [[0, 1]];
var apple = [25, 25];
var isGameOver = false;
var counter;

function main() {
  var canvas = document.getElementById("game");
  document.addEventListener("keydown", changeDirection, false);
  ctx = canvas.getContext("2d");
  counter = document.getElementById("counter");
  draw();
}

function gameOver() {
  turns = [[0, 1]];
  x = y = 250;
  isGameOver = true;
  ctx.clearRect(0, 0, 500, 500);
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", 250 - ctx.measureText("Game Over").width / 2, 250 - 15);
  ctx.font = "20px Arial";
  ctx.fillText("Press 'R' to restart", 250 - ctx.measureText("Press 'R' to restart").width / 2, 250 + 10);
}

function changeDirection(e) {
  switch (e.key) {
    case "w":
      if (direction[0] !== 0 && direction[1] !== -1)
        nextMovement = [0, 1]
      break;
    case "s":
      if (direction[0] !== 0 && direction[1] !== 1)
        nextMovement = [0, -1]
      break;
    case "a":
      if (direction[0] !== 1 && direction[1] !== 0)
        nextMovement = [-1, 0]
      break;
    case "d":
      if (direction[0] !== -1 && direction[1] !== 0)
        nextMovement = [1, 0]
      break;
    case "r":
      if (isGameOver)
        draw();
      break;
  }
}

function map(x) {
  if (x > 475)
    x -= 500;
  if (x < 0)
    x += 500;
  return x;
}

function newApple() {
  apple[0] = Math.floor(Math.random() * (20)) * 25;
  apple[1] = Math.floor(Math.random() * (20)) * 25;
  turns.push(direction);
}

function draw() {
  ctx.clearRect(0, 0, 500, 500);
  direction = nextMovement;
  turns.unshift(direction);
  turns.pop();
  x += 25 * direction[0];
  y -= 25 * direction[1];
  var curx = x, cury = y;
  for (var turn of turns) {
    curx -= 25 * turn[0];
    cury += 25 * turn[1];
    if (map(curx) === x && map(cury) === y) {
      gameOver();
      return;
    }
    if (map(curx) == apple[0] && map(cury) == apple[1])
      newApple();
    ctx.fillRect(map(curx) + 2, map(cury) + 2, 25 - 2, 25 - 2);
  }
  x = map(x), y = map(y);
  ctx.fillStyle = "red"
  ctx.fillRect(apple[0] + 2, apple[1] + 2, 25 - 2, 25 - 2);
  if ( apple[0] == x && apple[1] == y) {
    newApple();
  }
  ctx.fillRect(x + 2, y + 2, 25 - 2, 25 - 2);
  ctx.fillStyle = "black";
  counter.textContent = "Points: " + (turns.length - 1));
  setTimeout(draw, 100);
}
