let squares = [];
let currentSquare = 0;
let gameWon = false;
let canInteract = true;
let lastChange = 0;
let obstacleInterval = 1000; // Time between signal changes
let displaySize = 10; // 10 squares total
let pixelSize = 100;
let display;
let state = "blank"; // Initial state: "green"
let reverse = false; // Reverse mode starts after half the squares are filled
let reverseThreshold = displaySize / 2; // When reverse mode kicks in
let reverseAnimationDuration = 2000; // Duration of the reverse flash animation
let reverseAnimationStart = 0; // Start time for reverse flash animation
let reverseFlashing = false; // Flag to indicate flashing state
let signalDuration = 1000; // Duration of green/red signals (1 second)
let minBlankDuration = 1000; // Minimum random blank interval (1 second)
let maxBlankDuration = 3000; // Maximum random blank interval (3 seconds)
let nextSignalChange; // Time for the next state change
let blankDuration = 500; // Fixed duration for blank state signals (0.5 seconds)
let isBlankState = false; // Flag to track if the current state is blank
let flashInterval = 100; // Interval for flashing animation (every 100 ms)

let winFlashing = false; // Flag for win flashing
let winFlashStart = 0; // Time when win flashing started
let winFlashDuration = 3000; // How long the win flashing should last (3 seconds)
let winFlashInterval = 150; // How often to flash during win

let audioContext, oscillator;

class Display {
  constructor(_displaySize, _pixelSize) {
    this.displaySize = _displaySize;
    this.pixelSize = _pixelSize;
    this.initColor = color(0, 0, 0); // Default black color for no signal
    this.displayBuffer = [];

    for (let i = 0; i < this.displaySize; i++) {
      this.displayBuffer[i] = this.initColor;
    }
  }

  setPixel(_index, _color) {
    this.displayBuffer[_index] = _color;
  }

  show() {
    noStroke();
    for (let i = 0; i < this.displaySize; i++) {
      if (this.displayBuffer[i] !== this.initColor) {
        fill(this.displayBuffer[i]);
        rect(i * this.pixelSize, 0, this.pixelSize, this.pixelSize);
      }
    }
  }

  clear() {
    for (let i = 0; i < this.displaySize; i++) {
      this.displayBuffer[i] = this.initColor;
    }
  }

  setAllPixels(_color) {
    for (let i = 0; i < this.displaySize; i++) {
      this.setPixel(i, _color);
    }
  }
}

function preload() {
  // Initialize AudioContext for beeping
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function setup() {
  playBeep();
  createCanvas(displaySize * pixelSize, pixelSize);

  display = new Display(displaySize, pixelSize);

  // Initialize squares (represent progress)
  for (let i = 0; i < displaySize; i++) {
    squares.push(false);
  }

  // Set the first random signal change time
  nextSignalChange = signalDuration;
}

function keyPressed() {
  // Handle "g" for Go and "s" for Stop
  if (key === "g" || key === "s") {
    interact(key);
  }
}

function draw() {
  if (isBlankState) {
    background(0); // Black background during blank intervals
  } else if (state === "green" && !reverse) {
    background(0, 255, 0); // Green light (normal mode)
  } else if (state === "red" && !reverse) {
    background(255, 0, 0); // Red light (normal mode)
  } else if (state === "green" && reverse) {
    background(255, 0, 0); // Red light (reversed mode)
  } else if (state === "red" && reverse) {
    background(0, 255, 0); // Green light (reversed mode)
  }

  handleObstacles();
  drawSquares();

  if (currentSquare >= squares.length / 2) {
    reverse = true;
  } else {
    reverse = false;
  }

  if (reverseFlashing) {
    const elapsed = millis() - reverseAnimationStart;
    if (elapsed % (flashInterval * 2) < flashInterval) {
      fill(255, 255, 0); // Yellow flash color
    } else {
      fill(0); // Black flash color
    }
    rect(0, 0, width, height);
    if (elapsed > reverseAnimationDuration) {
      reverseFlashing = false;
    }
  }

  if (gameWon) {
    if (!winFlashing) {
      winFlashing = true;
      winFlashStart = millis();
    }

    const elapsed = millis() - winFlashStart;
    if (elapsed % (winFlashInterval * 2) < winFlashInterval) {
      display.setAllPixels(color(255, 255, 0)); // Flash color for winning
    } else {
      display.setAllPixels(color("#8ACE00")); // Stable color after win
    }
    display.show();

    if (elapsed > winFlashDuration) {
      noLoop();
    }
    return;
  }
}

function drawSquares() {
  display.clear();
  for (let i = 0; i < squares.length; i++) {
    if (squares[i]) {
      display.setPixel(i, color(255));
    }
  }
  display.show();
}

function interact(inputKey) {
  if (!canInteract || isBlankState) return;

  if (!reverse) {
    if (
      (state === "green" && inputKey === "g") ||
      (state === "red" && inputKey === "s")
    ) {
      progressPlayer();
    } else {
      loseProgress();
      playBeep(); // Play beep for incorrect input
    }
  } else {
    if (
      (state === "red" && inputKey === "s") ||
      (state === "green" && inputKey === "g")
    ) {
      progressPlayer();
    } else {
      loseProgress();
      playBeep(); // Play beep for incorrect input
    }
  }

  handleSignalEnd();
}

function progressPlayer() {
  let previousSquare = currentSquare;

  if (currentSquare < squares.length) {
    squares[currentSquare] = true;
    currentSquare++;

    if (currentSquare === squares.length) {
      gameWon = true;
    }

    if (
      (previousSquare === 4 && currentSquare === 5) ||
      (previousSquare === 5 && currentSquare === 4)
    ) {
      startReverseFlash();
    }
  }
}

function loseProgress() {
  if (currentSquare > 0) {
    currentSquare--;
    squares[currentSquare] = false;
  }
}

function handleObstacles() {
  if (millis() - lastChange > nextSignalChange) {
    toggleState();
    lastChange = millis();

    if (state === "blank") {
      isBlankState = true;
      setTimeout(() => {
        isBlankState = false;
        nextSignalChange = random(minBlankDuration, maxBlankDuration);
      }, blankDuration);
    } else {
      nextSignalChange = signalDuration;
    }
  }
}

function handleSignalEnd() {
  isBlankState = true;
  lastChange = millis();
}

function toggleState() {
  if (state === "green") {
    state = "blank";
  } else if (state === "red") {
    state = "blank";
  } else {
    state = random(["green", "red"]);
    isBlankState = false;
  }
}

function startReverseFlash() {
  reverseFlashing = true;
  reverseAnimationStart = millis();
}

function playBeep() {
  oscillator = audioContext.createOscillator();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
  oscillator.connect(audioContext.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 200); // Beep duration
}
