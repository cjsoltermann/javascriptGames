var boxSize = 10;
var width = 500;
var gameSpeed = 10;
var boxes = [];
var canvas, ctx;
var player1, player2;
var keys = {};
var keyFuncs = {};
var mouseX;
var mouseY;
var canvasX, canvasY;

var Box = {}

Box.box = function(x, y, color, size) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.color = color ? color : "red";
  this.size = size ? size : 1;

  this.draw = function(x, y) {
    ctx.fillStyle = this.color;
    var size = this.size * boxSize;
    ctx.fillRect((x ? x : 0) + this.x, (y ? y : 0) + this.y, size, size);
  }
}

function draw() {
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,width,width);
  for (let box of boxes) {
    box.draw();
  }
}

Box.physicsBox = function(x, y, color, size, vx, vy) {
  Box.box.call(this, x, y, color, size);
  this.vx = vx ? vx : 0;
  this.vy = vy ? vy : 0;
  
  this.update = function () {};
  this._update = function() {
    this.update();
    this.x += this.vx;
    this.y += this.vy;
  }
}

Box.collection = function(x, y, boxes) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.boxes = boxes ? boxes : [];

  this.draw = function(x, y) {
    for (let box of this.boxes) {
      box.draw((x ? x : 0) + this.x, (y ? y : 0) + this.y);
    }
  }

  this.addBox = function(box) {
    this.boxes.push(box); 
  }

  this.addBoxes = function() {
    for (argument of arguments)
      this.boxes.push(argument);
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
  canvasX = canvas.getBoundingClientRect().left;
  canvasY = canvas.getBoundingClientRect().top;
  document.addEventListener("keydown", function(e) { keys[e.key] = 1; }, false);
  document.addEventListener("keyup", function(e) { keys[e.key] = 0; }, false);
  canvas.addEventListener("mousemove", function(e) { mouseX = e.clientX - canvasX; mouseY = e.clientY - canvasY; }, false);
}

function safeMove(object, x, y) {
  object.x += x;
  if (offScreen(object)) {
    object.x -= x;
  }
  object.y += y;
  if (offScreen(object)) {
    object.y -= y;
  }
}

function shootBullet(src, x, y) {
  if (!src.coolDown > 0) {
    var bullet = new Box.physicsBox(src.x + 30, src.y, "yellow", 0.5, x, y);
    addBox(bullet);
    bullet.update = function() {if (offScreen(this)) { removeBox(this) }};
    src.coolDown = 10;
  }
  src.coolDown--;
}

function main() {
  setup();

  player1 = new Box.collection(5, 5);
  player1.addBox(new Box.box(0, 0));
  player1.size = 1;
  onKeyDown("w", function () { safeMove(player1, 0, -1); })
  onKeyDown("a", function () { safeMove(player1, -1, 0); })
  onKeyDown("s", function () { safeMove(player1, 0, 1); })
  onKeyDown("d", function () { safeMove(player1, 1, 0); })
  onKeyDown("f", function () { shootBullet(player1, 2, 0); });

  player2 = new Box.box(25, 25, "blue");
  onKeyDown("ArrowUp", function () { safeMove(player2, 0, -1); });
  onKeyDown("ArrowLeft", function () { safeMove(player2, -1, 0); });
  onKeyDown("ArrowDown", function () { safeMove(player2, 0, 1); });
  onKeyDown("ArrowRight", function () { safeMove(player2, 1, 0); });
  onKeyDown("1", function () { shootBullet(player2, 1, 0); });

  collectionTest = new Box.collection(20, 0);
  collectionTest.addBox(new Box.box(2.5, 0, "gray", .6));
  collectionTest.addBox(new Box.box(-2.5, 0, "gray", .6));
  player1.addBox(collectionTest);

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
