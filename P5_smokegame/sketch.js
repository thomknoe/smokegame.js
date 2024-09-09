let squares = [];
let currentSquare = 0;
let gameWon = false;
let gameLost = false;
let canInteract = true;
let lastObstacleTime = 0;
let obstacleInterval = 0;

function preload() {
  bgm = loadSound("365_partygirl.mp3");
}

function setup() {
  for (let i = 0; i < 10; i++) {
    squares.push(false);
  }
  //createButton('bumpin that').mousePressed(interact);
  bgm.loop();
}

function keyPressed() {
  if (key == " ") {
    interact();
  }
}

function draw() {
  createCanvas(windowWidth, windowHeight);
  if (gameWon) {
    background("#8ACE00");
  } else if (gameLost) {
    background("#BD3619");
  } else {
    background(0);
    handleObstacles();
    drawSquares();
  }
}

function drawSquares() {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i]) {
      fill("#8ACE00");
    } else {
      fill(0);
    }
    stroke(255);
    rect(
      windowWidth / 2 - (squares.length / 2) * 50 + i * 50,
      windowHeight / 2 - 25,
      40,
      40
    );
  }
}

function keyIsPressed() {
  if (key === "SPACE") {
    interact();
  }
}

function interact() {
  if (!canInteract) {
    gameLost = true;
    return;
  }

  if (currentSquare < squares.length) {
    squares[currentSquare] = true;
    currentSquare++;

    if (currentSquare === squares.length) {
      gameWon = true;
    }
  }
}

function handleObstacles() {
  if (millis() - lastObstacleTime > obstacleInterval) {
    canInteract = !canInteract;
    lastObstacleTime = millis();
    obstacleInterval = random(100, 2000);
  }

  if (!canInteract) {
    background(255, 0, 0);
  }
}
