var box = 5;
var ctx, canvas;
var apple1 = [0,0,1,"red"];
var apple2 = [0,0,1,"red"];
var isGameOver = false;
var counter1, counter2;
var player1, player2;
var apples = [[1, "red"], [5, "blue"], [10, "green"], [20, "purple"], [50, "pink"], [100, "brown"], [500, "black"]]
var difficulty = 0;

function player(x, y) {
  this.x = this.y = 50;
  this.nextMovement = this.direction = [0, 1];
  this.turns = [[0, 1]];
  this.points = this.tailsToGive = 0;
}

function main() {
  canvas = document.getElementById("game");
  document.addEventListener("keydown", changeDirection, false);
  ctx = canvas.getContext("2d");
  counter1 = document.getElementById("counter1");
  counter2 = document.getElementById("counter2");
  player1 = new player(50, 50);
  player2 = new player(450, 450);
  newApple(apple1);
  newApple(apple2);
  draw();
}

function gameOver(player) {
  player.turns = [[0, 1]];
  player.points = 0;
  player.tailsToGive = 0;
}

function changeDirection(e) {
  switch (e.key) {
    case "w":
      if (player1.direction[0] !== 0 && player1.direction[1] !== -1)
        player1.nextMovement = [0, 1]
      break;
    case "s":
      if (player1.direction[0] !== 0 && player1.direction[1] !== 1)
        player1.nextMovement = [0, -1]
      break;
    case "a":
      if (player1.direction[0] !== 1 && player1.direction[1] !== 0)
        player1.nextMovement = [-1, 0]
      break;
    case "d":
      if (player1.direction[0] !== -1 && player1.direction[1] !== 0)
        player1.nextMovement = [1, 0]
      break;
    case "ArrowUp":
      if (player2.direction[0] !== 0 && player2.direction[1] !== -1)
        player2.nextMovement = [0, 1]
      break;
    case "ArrowDown":
      if (player2.direction[0] !== 0 && player2.direction[1] !== 1)
        player2.nextMovement = [0, -1]
      break;
    case "ArrowLeft":
      if (player2.direction[0] !== 1 && player2.direction[1] !== 0)
        player2.nextMovement = [-1, 0]
      break;
    case "ArrowRight":
      if (player2.direction[0] !== -1 && player2.direction[1] !== 0)
        player2.nextMovement = [1, 0]
      break;
  }
}

function map(x) {
  if (x > canvas.width - box)
    x -= canvas.width;
  if (x < 0)
    x += canvas.width;
  return x;
}

function newApple(apple) {
  apple[0] = Math.floor(Math.random() * (canvas.width / box)) * box;
  apple[1] = Math.floor(Math.random() * (canvas.width / box)) * box;
  apple[2] = (Math.floor(apples[difficulty][0] / box) + 1) * 10;
  apple[3] = apples[difficulty][1];
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.width);

  function movePlayer(player, enemy) {
    player.direction = player.nextMovement;
    if (player.tailsToGive > 0) {
      player.turns.push(player.turns[player.turns.length -1]);
      player.tailsToGive--;
    }
    player.turns.unshift(player.direction);
    player.turns.pop();
    player.x += box * player.direction[0];
    player.y -= box * player.direction[1];
    var curx = player.x, cury = player.y;
    for (var turn of player.turns) {
      curx = map(curx - (box * turn[0]));
      cury = map(cury + (box * turn[1]));
      if (curx === player.x && cury === player.y) {
        gameOver(player);
        return;
      }
      if (curx == enemy.x && cury == enemy.y) {
        gameOver(enemy);
      }
      if (curx == apple1[0] && cury == apple1[1])
        newApple(apple1);
      if (curx == apple2[0] && cury == apple2[1])
        newApple(apple2);
      ctx.fillRect(curx + 2, cury + 2, box - 2, box - 2);
    }
    player.x = map(player.x), player.y = map(player.y);
    if ( apple1[0] == player.x && apple1[1] == player.y) {
      player.points += 1;
      player.tailsToGive += apple1[2];
      newApple(apple1);
    }
    if ( apple2[0] == player.x && apple2[1] == player.y) {
      player.points += 1;
      player.tailsToGive += apple2[2];
      newApple(apple2);
    }
    ctx.fillStyle = "red"
    ctx.fillRect(player.x + 2, player.y + 2, box - 2, box - 2);
  }

  difficulty = Math.floor(((player1.points + player2.points) / 20) * 6);
  if (difficulty > 5)
    difficulty = 6;

  movePlayer(player1, player2);
  movePlayer(player2, player1);

  ctx.fillStyle = apple1[3];
  ctx.fillRect(apple1[0] + 2, apple1[1] + 2, box - 2, box - 2);

  ctx.fillStyle = apple2[3];
  ctx.fillRect(apple2[0] + 2, apple2[1] + 2, box - 2, box - 2);
  
  ctx.fillStyle = "black";
  counter1.textContent = "Player 1 Points: " + (player1.points);
  counter2.textContent = "Player 2 Points: " + (player2.points);
  setTimeout(draw, 100);
}
