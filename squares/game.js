var Box = {
  boxSize: 10,
  width: 500,
  gameSpeed: 10,
  boxes: [],
  canvas: {}, ctx: {},
  player1: {}, player2: {},
  keys: {},
  controllers: [],
  keyFuncs: {},
  mouseX: {}, mouseY: {},
  canvasX: {}, canvasY: {}
}

Box.box = function(x, y, color, size) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.color = color ? color : "red";
  this.size = size ? size : 1;
  this.rotation = 0;
  this.center = [0, 0];

  this.draw = function(x, y) {
    Box.ctx.fillStyle = this.color;
    var size = this.size * Box.boxSize;

    var r = this.rotation % (Math.PI * 2);
    if (r != 0) {
      Box.ctx.save();
      Box.ctx.translate(this.x + this.center[0], this.y + this.center[1]);
      Box.ctx.rotate(r);
      Box.ctx.translate(-this.center[0], -this.center[1]);
      Box.ctx.fillRect(0, 0, size, size);
      Box.ctx.restore();
      return;
    }

    Box.ctx.fillRect((x ? x : 0) + this.x, (y ? y : 0) + this.y, size, size);
  }
}

function draw() {
  Box.ctx.fillStyle = "white";
  Box.ctx.fillRect(0,0,Box.width,Box.width);
  for (let box of Box.boxes) {
    box.draw();
  }
}

Box.physicsBox = function(x, y, color, size, vx, vy, vr) {
  Box.box.call(this, x, y, color, size);
  this.vx = vx ? vx : 0;
  this.vy = vy ? vy : 0;
  this.vr = vr ? vr : 0;
  
  this.update = function () {};
  this._update = function() {
    this.update();
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vr;
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
    for (let argument of arguments)
      this.boxes.push(argument);
  }
}

function addBox(box) {
  Box.boxes.push(box);
}

function addBoxes() {
  for (let argument of arguments)
    Box.boxes.push(argument);
}

function removeBox(box) {
  var index = Box.boxes.indexOf(box);
  if (index !== -1)
    Box.boxes.splice(index, 1);
}

function removeBoxes() {
  for (let arg of arguments)
    removeBox(arg);
}

function setup() {
  Box.canvas = document.getElementById("game");
  Box.ctx = Box.canvas.getContext("2d");
  Box.canvas.width = Box.width;
  Box.canvas.height = Box.width;
  Box.canvasX = Box.canvas.getBoundingClientRect().left;
  Box.canvasY = Box.canvas.getBoundingClientRect().top;
  document.addEventListener("keydown", function(e) { Box.keys[e.key] = 1; }, false);
  document.addEventListener("keyup", function(e) { Box.keys[e.key] = 0; }, false);
  Box.canvas.addEventListener("mousemove", function(e) { Box.mouseX = e.clientX - Box.canvasX; Box.mouseY = e.clientY - Box.canvasY; }, false);
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
    var bullet = new Box.physicsBox(src.x + 30, src.y, "black", 0.5, x, y, 0.1);
    addBox(bullet);
    bullet.update = function() {if (offScreen(this)) { removeBox(this) }};
    src.coolDown = 10;
  }
  src.coolDown--;
}

function controller(box, up, down, left, right) {
  if (Box.keys[up])
    safeMove(box, 0, -1);
  else if (Box.keys[down])
    safeMove(box, 0, 1);
  
  if (Box.keys[left])
    safeMove(box, -1, 0);
  else if (Box.keys[right])
    safeMove(box, 1, 0);
}

function main() {
  setup();

  Box.player1 = new Box.collection(5, 5);
  Box.player1.addBox(new Box.box(0, 0));
  Box.player1.size = 1;
  addController("w s a d", function() { controller(Box.player1, "w", "s", "a", "d") });
  onKeyDown("f", function (key) { shootBullet(Box.player1, 2, 0); });

  Box.player2 = new Box.box(25, 25, "blue");
  addController("ArrowUp ArrowDown ArrowLeft ArrowRight", function() { controller(Box.player2, "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight") });
  onKeyDown("1", function (key) { shootBullet(Box.player2, 1, 0); });

  collectionTest = new Box.collection(20, 0);
  collectionTest.addBox(new Box.box(2.5, 0, "gray", .6));
  collectionTest.addBox(new Box.box(-2.5, 0, "gray", .6));
  Box.player1.addBox(collectionTest);

  Box.rotationTest = new Box.box(200, 200, "red", 5);
  Box.rotationTest.center = [25, 25];
  onKeyDown("p", function () { Box.rotationTest.rotation += .1} );

  addBoxes(Box.player1, Box.player2, Box.rotationTest);
  gameLoop();
}

function onKeyDown(key, func) {
  var keys = key.split(" ");
  for (let k in keys)
    Box.keyFuncs[keys[k]] = func;
}

function addController(keys, func) {
  var controller = { keys: keys.split(" "), func: func };
  Box.controllers.push(controller);
}

function processKeys() {
  for (let key in Box.keys) {
    if (Box.keys[key] && Box.keyFuncs[key])
      Box.keyFuncs[key](key);
  }
  for (let c in Box.controllers) {
    for (let key in Box.controllers[c].keys) {
      if (Box.keys[Box.controllers[c].keys[key]]) {
        Box.controllers[c].func();
        break;
      }
    }
  }
}

function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 10 / Box.gameSpeed);
}

function offScreen(thing) {
  size = thing.size ? thing.size * Box.boxSize : 0;
  if (thing.x > Box.width - size || thing.x < 0 || thing.y > Box.width - size || thing.y < 0)
    return true;
  return false;
}

function update() {
  processKeys();
  for (let box of Box.boxes)
    if (box._update)
      box._update()
}
