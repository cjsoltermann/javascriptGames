var boxSize = 10;
var width = 500;
var gameSpeed = 10;
var boxes = [];
var canvas, ctx;
var player1, player2;
var keys = {};

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

function main() {
  setup();
  player1 = new box(5, 5);
  player2 = new box(25, 25, "blue");
  var bullet = new physicsBox(.5,0,{size:0.5});
  addBoxes(player1, player2, bullet);
  gameLoop();
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

function movement() {
  if (keys["w"]) {
    player1.y--;
    if (offScreen(player1))
      player1.y++;
  }
  if (keys["a"]) {
    player1.x--;
    if (offScreen(player1))
      player1.x++;
  }
  if (keys["s"]) {
    player1.y++;
    if (offScreen(player1))
      player1.y--;
  }
  if (keys["d"]) {
    player1.x++;
    if (offScreen(player1))
      player1.x--;
  }
  if (keys["ArrowUp"]) {
    player2.y--;
    if (offScreen(player1))
      player1.y++;
  }
  if (keys["ArrowLeft"]) {
    player2.x--;
    if (offScreen(player1))
      player1.x++;
  }
  if (keys["ArrowDown"]) {
    player2.y++;
    if (offScreen(player1))
      player1.y--;
  }
  if (keys["ArrowRight"]) {
    player2.x++;
    if (offScreen(player1))
      player1.x--;
  }
  if (keys["f"]) {
    var bullet = new physicsBox(0.5, 1, {size:0.5,color:"yellow",x:player1.x,y:player1.y});
    addBox(bullet);
    bullet.update = function() {if (offScreen(this)) { removeBox(this); }};
  }
  if (keys["1"]) {
    var bullet = new physicsBox(0.5, 1, {size:0.5,color:"yellow",x:player2.x,y:player2.y});
    addBox(bullet);
    bullet.update = function() {if (offScreen(this)) { removeBox(this); }};
  }
}

function update() {
  movement();
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
