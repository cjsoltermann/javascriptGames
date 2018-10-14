var boxSize = 10;
var width = 500;
var gameSpeed = 10;
var boxes = [];
var canvas, ctx;
var player1, player2;
var keys = {};

function box(x, y, color, size) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.color = color ? color : "red";
  this.size = size ? size : 1;
  boxes.push(this);
}

function setup() {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = width;
  document.addEventListener("keydown", function(e) { keys[e.key] = 1; }, false);
  document.addEventListener("keyup", function(e) { keys[e.key] = 0; }, false);
}

function main() {
  setup();
  player1 = new box(5, 5);
  player2 = new box(25, 25, "blue");
  gameLoop();
}

function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 10 / gameSpeed);
}

function update() {
  if (keys["w"])
    player1.y--;
  if (keys["a"])
    player1.x--;
  if (keys["s"])
    player1.y++;
  if (keys["d"])
    player1.x++;
  if (keys["ArrowUp"])
    player2.y--;
  if (keys["ArrowLeft"])
    player2.x--;
  if (keys["ArrowDown"])
    player2.y++;
  if (keys["ArrowRight"])
    player2.x++;
}

function draw() {
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,width,width);
  for (let box of boxes) {
    var size = box.size * boxSize;
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, size, size); 
  }
}
