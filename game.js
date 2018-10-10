var direction = 1;
var currentDirection = 1;
var x = 250;
var y = 250;
var ctx;
var turns = [0];
var apple = [25, 25];

function main() {
  var canvas = document.getElementById("game");
  document.addEventListener("keydown", changeDirection, false);
  ctx = canvas.getContext("2d");
  draw();
}

function gameOver() {
  ctx.clearRect(0, 0, 500, 500);
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", 250 - ctx.measureText("Game Over").width / 2, 250 - 15);
}

function changeDirection(e) {
  switch (e.key) {
    case "w":
      if (currentDirection !== 1)
        direction = 0;
      break;
    case "s":
      if (currentDirection !== 0)
        direction = 1;
      break;
    case "a":
      if (currentDirection !== 3)
        direction = 2;
      break;
    case "d":
      if (currentDirection !== 2)
        direction = 3;
      break;
    case " ":
      turns.push(direction);
      break;
    case "p":
      x = 250;
      y = 250;
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

function draw() {
  ctx.clearRect(0, 0, 500, 500);
  turns.unshift(direction);
  turns.pop();
  switch (direction) {
    case 0:
      y -= 25;
      break;
    case 1:
      y += 25;
      break;
    case 2:
      x -= 25;
      break;
    case 3:
      x += 25;
      break;
  }
  currentDirection = direction;
  var curx = x, cury = y;
  for (var turn of turns) {
    switch (turn) {
      case 0:
        cury += 25;
        break;
      case 1:
        cury -= 25;
        break;
      case 2:
        curx += 25;
        break;
      case 3:
        curx -= 25;
        break;
    }
    if (curx === x && cury === y) {
      gameOver();
      return;
    }
    ctx.fillRect(map(curx) + 2, map(cury) + 2, 25 - 2, 25 - 2);
  }
  x = map(x), y = map(y);
  ctx.fillStyle = "red"
  ctx.fillRect(apple[0] + 2, apple[1] + 2, 25 - 2, 25 - 2);
  if ( apple[0] == x && apple[1] == y) {
     apple[0] = Math.floor(Math.random() * (20)) * 25;
     apple[1] = Math.floor(Math.random() * (20)) * 25;
     turns.push(direction);
  }
  ctx.fillRect(x + 2, y + 2, 25 - 2, 25 - 2);
  ctx.fillStyle = "black";
  setTimeout(draw, 100);
}
