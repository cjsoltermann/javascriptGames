var boxSize = 10;
var width = 500;
var gameSpeed = 10;
var boxes = [];
var canvas, ctx;
var player1, player2;
var keys = {};
var keyFuncs = {};

function box(x, y, color, size, vx, vy) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.color = color ? color : "red";
  this.size = size ? size : 1;
}

function physicsBox(vx, vy, box) {
  this.x = box && box.x ? box.x : 0;
  this.y = box && box.y ? box.y : 0;
  this.color = box && box.color ? box.color : "red";
  this.size = box && box.size ? box.size : 1;
  
  this.vx = vx ? vx : 0;
  this.vy = vy ? vy : 0;
  this.update = function () {};
  this._update = function() {
    this.update();
    this.x += this.vx;
    this.y += this.vy;
  }
}

function addBox(box) {
  boxes.push(box);
}

function addBoxes() {
  for (argument of arguments)
    boxes.push(argument);
}

function removeBox(box) {
  var index = boxes.indexOf(box);
  if (index !== -1)
    boxes.splice(index, 1);
}

function removeBoxes() {
  for (arg of arguments)
    removeBox(arg);
}

function setup() {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = width;
  document.addEventListener("keydown", function(e) { keys[e.key] = 1; }, false);
  document.addEventListener("keyup", function(e) { keys[e.key] = 0; }, false);
}

function safeMove(object, x, y) {
  object.x += x;
  object.y += y;
  if (offScreen(object)) {
    object.x -= x;
    object.y -= y;
  }
}

function shootBullet(src, x, y) {
  var bullet = new physicsBox(x, y, {size: 0.5, color: "yellow", x: src.x, y: src.y});
  addBox(bullet);
  bullet.update = function() {if (offScreen(this)) { removeBox(this) }};
}

function main() {
  setup();

  player1 = new box(5, 5);
  onKeyDown("w", function () { safeMove(player1, 0, -1); })
  onKeyDown("a", function () { safeMove(player1, -1, 0); })
  onKeyDown("s", function () { safeMove(player1, 0, 1); })
  onKeyDown("d", function () { safeMove(player1, 1, 0); })
  onKeyDown("f", function () { shootBullet(player1, 1, 0); });
  onKeyDown("q", function () { player1.size++; player1.x -= boxSize / 2; player1.y -= boxSize / 2});
  onKeyDown("e", function () { player1.size--; player1.x += boxSize / 2; player1.y += boxSize / 2});

  player2 = new box(25, 25, "blue");
  onKeyDown("ArrowUp", function () { safeMove(player2, 0, -1); });
  onKeyDown("ArrowLeft", function () { safeMove(player2, -1, 0); });
  onKeyDown("ArrowDown", function () { safeMove(player2, 0, 1); });
  onKeyDown("ArrowRight", function () { safeMove(player2, 1, 0); });
  onKeyDown("1", function () { shootBullet(player2, 1, 0); });

  addBoxes(player1, player2);
  gameLoop();
}

function onKeyDown(key, func) {
  keyFuncs[key] = func;
}

function processKeys() {
  for (key in keys) {
    if (keys[key] && keyFuncs[key])
      keyFuncs[key]();
  }
}

function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 10 / gameSpeed);
}

function offScreen(thing) {
  size = thing.size ? thing.size * boxSize : 0;
  if (thing.x > width - size || thing.x < 0 || thing.y > width - size || thing.y < 0)
    return true;
  return false;
}

function update() {
  processKeys();
  for (let box of boxes)
    if (box._update)
      box._update()
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
