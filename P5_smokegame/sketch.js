let squares = [];
let currentSquare = 0;
let gameWon = false;
let gameLost = false;
let canInteract = true;
let lastObstacleTime = 0;
let obstacleInterval = 0;

let displaySize = 10;   
let pixelSize = 30;     
let display;

let bgm;

function preload() {
  bgm = loadSound("365_partygirl.mp3");
}


class Display {

  constructor(_displaySize, _pixelSize) {
    this.displaySize = _displaySize;
    this.pixelSize = _pixelSize;
    this.initColor = color(0, 0, 0);     
    this.displayBuffer = [];


    for(let i = 0; i < this.displaySize; i++){
      this.displayBuffer[i] = this.initColor;
    }
  }

 
  setPixel(_index, _color) {
    this.displayBuffer[_index]  = _color;
  }


  setAllPixels(_color) {
    for(let i = 0; i < this.displaySize; i++) { 
      this.setPixel(i, _color); 
    }
  }


  show() {
    noStroke();
    for (let i = 0; i < this.displaySize; i++) {
      fill(this.displayBuffer[i]);
      rect(i * this.pixelSize, 0, this.pixelSize, this.pixelSize);
    }
  }

  
  clear() {
    for(let i = 0; i < this.displaySize; i++) {    
      this.displayBuffer[i] = this.initColor; 
    }
  }
}

function setup() {
  createCanvas(displaySize * pixelSize, pixelSize);
  bgm.loop();
  
  display = new Display(displaySize, pixelSize);

  for (let i = 0; i < displaySize; i++) {
    squares.push(false);
  }
}

function keyPressed(){
  if (key == "A" || key == "a"){
    interact();
  }
}

function draw() {
  if (gameWon) {
    background('#8ACE00');
  } else if (gameLost) {
    background(255, 0, 0);
  } else {
    background(0);
    handleObstacles();
    drawSquares();
  }
}

function drawSquares() {

  display.clear();

  
  for (let i = 0; i < squares.length; i++) {
    if (squares[i]) {
  display.setPixel(i, color('#8ACE00')); 
} else {
  if (canInteract) {
    display.setPixel(i, color(0)); 
  } else {
    display.setPixel(i, color(255, 0, 0)); 
  }
}

}

  display.show();
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
   
  }
}
