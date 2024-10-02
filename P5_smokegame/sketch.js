let progress = 0; // Player progress (0 to width)
let signal = ""; // Current signal: 'green', 'red', or 'empty'
let signalTimer = 0; // Timer for signal duration
let fadeAmount = 0; // Interpolation value for green fade (0 to 1)
let signalInterval = 100; // Controls when to swap signals
let fadeSpeed = 0.005; // Speed of fade in/out interpolation for green signal
let keyHeld = false; // Tracks if player is holding the correct key
let stageTwo = false; // Check if we are in stage 2
let emptyInterval = 60; // Duration for the empty space state
let beep; // Oscillator for the beep sound
let beepFrequency = 440; // Frequency for the discordant square wave beep sound
let beepDuration = 0.1; // Duration for the beep sound

let greenSignalCount = 0; // Counter for consecutive green signals
let progressLossRate = 0.5; // Rate of progress loss

function setup() {
  createCanvas(800, 50); // Set canvas dimensions to match the progress bar
  frameRate(60);

  // Initialize the square wave oscillator
  beep = new p5.Oscillator("square"); // Create a square wave oscillator
  beep.freq(beepFrequency); // Set frequency
  beep.amp(0); // Set amplitude to 0 initially
  nextSignal(); // Start with a random signal
}

function draw() {
  // Interpolate between black and green for the green signal
  if (signal === "green") {
    let r = lerp(0, 0, fadeAmount); // Red stays the same (0)
    let g = lerp(0, 255, fadeAmount); // Green value interpolates
    let b = lerp(0, 0, fadeAmount); // Blue stays the same (0)
    background(r, g, b); // Set background to interpolated color
  } else if (signal === "red") {
    background(255, 0, 0); // Red signal (no interpolation)
  } else {
    background(0); // Empty space (black background)
  }

  // Draw the white progress bar on top of the background
  fill(255);
  noStroke();
  rect(0, 0, progress, height);

  // Manage signal timer and fade in/out logic for green
  signalTimer++;
  if (signal === "green") {
    handleGreenSignal(); // Handle fade-in and fade-out of green
  } else if (signal === "red") {
    progress -= progressLossRate; // Automatically lose progress during green
    if (signalTimer >= signalInterval) {
      nextSignal(); // Red signal switches after its interval
    }
  } else if (signal === "empty" && signalTimer >= emptyInterval) {
    nextSignal(); // Empty state switches after the interval
  }

  // Handle continuous progress or incremental progress based on the signal and stage
  if (!stageTwo && signal === "green" && keyHeld) {
    progress += 1; // Continuous smooth progress in stage 1 (green signal)
  } else if (stageTwo && signal === "red" && keyHeld) {
    progress += 1.5; // Continuous smooth progress in stage 2 (red signal)
  }

  // Ensure progress doesn't go below zero
  if (progress <= 0) {
    progress = 0;
  }

  // Stage progression logic
  if (progress >= width && !stageTwo) {
    stageTwo = true; // Start stage 2
    progress = 0; // Reset progress for stage 2
  }

  if (stageTwo && progress >= width) {
    noLoop(); // End the game when stage 2 is completed
  }
}

// Handle fade-in and fade-out of green signal without alpha
function handleGreenSignal() {
  let fadeStartTime = signalInterval - 200; // Start fading out at 200 frames before the end

  if (signalTimer < fadeStartTime) {
    fadeAmount = min(fadeAmount + fadeSpeed, 1); // Fade in (interpolation towards green)
  } else {
    fadeAmount = max(fadeAmount - fadeSpeed, 0); // Fade out (interpolation back to black)
    if (fadeAmount === 0) {
      nextSignal(); // Switch to empty state after fading out
    }
  }
}

function nextSignal() {
  signalTimer = 0;
  fadeAmount = 0;

  // Alternate 2-3 green signals followed by a red signal
  if (greenSignalCount < 2 || (greenSignalCount === 2 && random() > 0.7)) {
    signal = "green";
    greenSignalCount++;
  } else {
    signal = "red";
    greenSignalCount = 0; // Reset green signal count after a red signal
  }

  // Adjust signal durations for red and green
  if (signal === "red") {
    signalInterval = random(150, 200); // Extended duration for red signal
  } else if (signal === "green") {
    signalInterval = random(300, 400); // Increased duration for green signal
  }
}

// Handle key presses for red and green signals
function keyPressed() {
  if (!stageTwo) {
    if (signal === "green" && key === "g") {
      keyHeld = true; // Start holding key for continuous progress (stage 1)
    } else if (signal === "red" && key === "r") {
      progress += 20; // Incremental progress for red signal in stage 1
    } else {
      progress -= 20; // Wrong input, lose progress
      playBeep(); // Play beep sound for incorrect input
    }
  } else {
    if (signal === "red" && key === "g") {
      keyHeld = true; // Hold for continuous progress in stage 2
    } else if (signal === "green" && key === "r") {
      progress += 20; // Incremental progress for green signal in stage 2
    } else {
      progress -= 20; // Wrong input, lose progress
      playBeep(); // Play beep sound for incorrect input
    }
  }
}

// Stop continuous progress if key is released
function keyReleased() {
  if (key === "g") {
    keyHeld = false;
  }
}

// Play discordant beep sound
function playBeep() {
  beep.freq(220); // Set frequency to a discordant tone
  beep.amp(0.5, 0.01); // Set amplitude for a stronger beep
  beep.start(); // Start the beep
  setTimeout(() => {
    beep.amp(0, 0.1); // Fade out the beep
  }, beepDuration * 1000);
}
