var direction = 1;
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

function changeDirection(e) {
  switch (e.key) {
    case "w":
      if (direction !== 1)
        direction = 0;
      break;
    case "s":
      if (direction !== 0)
        direction = 1;
      break;
    case "a":
      if (direction !== 3)
        direction = 2;
      break;
    case "d":
      if (direction !== 2)
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
    ctx.fillRect(map(curx), map(cury), 25, 25);
  }
  x = map(x), y = map(y);
  ctx.fillStyle = "red"
  ctx.fillRect(apple[0], apple[1], 25, 25);
  if ( apple[0] == x && apple[1] == y) {
     apple[0] = Math.floor(Math.random() * (20)) * 25;
     apple[1] = Math.floor(Math.random() * (20)) * 25;
     turns.push(direction);
  }
  ctx.fillRect(x, y, 25, 25);
  ctx.fillStyle = "black";
  setTimeout(draw, 100);
}
