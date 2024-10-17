let progress = 0;
let signal = "";
let signalTimer = 0;
let fadeAmount = 0;
let signalInterval = 100;
let fadeSpeed = 0.005;
let keyHeld = false;
let stageTwo = false;
let emptyInterval = 60;
let beep;
let beepFrequency = 440;
let beepDuration = 0.1;

let greenSignalCount = 0;
let progressLossRate = 0.5;

function setup() {
  createCanvas(1200, 50);
  frameRate(60);

  beep = new p5.Oscillator("square");
  beep.freq(beepFrequency);
  beep.amp(0);
  nextSignal();
}

function draw() {
  if (signal === "green") {
    let r = lerp(0, 0, fadeAmount);
    let g = lerp(0, 255, fadeAmount);
    let b = lerp(0, 0, fadeAmount);
    background(r, g, b);
  } else if (signal === "red") {
    background(255, 0, 0);
  } else {
    background(0);
  }

  fill(255);
  noStroke();
  rect(0, 0, progress, height);

  signalTimer++;
  if (signal === "green") {
    handleGreenSignal();
  } else if (signal === "red") {
    progress -= progressLossRate;
    if (signalTimer >= signalInterval) {
      nextSignal();
    }
  } else if (signal === "empty" && signalTimer >= emptyInterval) {
    nextSignal();
  }

  if (!stageTwo && signal === "green" && keyHeld) {
    progress += 1;
  } else if (stageTwo && signal === "red" && keyHeld) {
    progress += 1.5;
  }

  if (progress <= 0) {
    progress = 0;
  }

  if (progress >= width && !stageTwo) {
    stageTwo = true;
    progress = 0;
  }

  if (stageTwo && progress >= width) {
    noLoop();
  }
}

function handleGreenSignal() {
  let fadeStartTime = signalInterval - 200;

  if (signalTimer < fadeStartTime) {
    fadeAmount = min(fadeAmount + fadeSpeed, 1);
  } else {
    fadeAmount = max(fadeAmount - fadeSpeed, 0);
    if (fadeAmount === 0) {
      nextSignal();
    }
  }
}

function nextSignal() {
  signalTimer = 0;
  fadeAmount = 0;

  if (greenSignalCount < 2 || (greenSignalCount === 2 && random() > 0.7)) {
    signal = "green";
    greenSignalCount++;
  } else {
    signal = "red";
    greenSignalCount = 0;
  }

  if (signal === "red") {
    signalInterval = random(150, 200);
  } else if (signal === "green") {
    signalInterval = random(300, 400);
  }
}

function keyPressed() {
  if (!stageTwo) {
    if (signal === "green" && key === "g") {
      keyHeld = true;
    } else if (signal === "red" && key === "r") {
      progress += 20;
    } else {
      progress -= 20;
      playBeep();
    }
  } else {
    if (signal === "red" && key === "g") {
      keyHeld = true;
    } else if (signal === "green" && key === "r") {
      progress += 20;
    } else {
      progress -= 20;
      playBeep();
    }
  }
}

function keyReleased() {
  if (key === "g") {
    keyHeld = false;
  }
}

function playBeep() {
  beep.freq(220);
  beep.amp(0.5, 0.01);
  beep.start();
  setTimeout(() => {
    beep.amp(0, 0.1);
  }, beepDuration * 1000);
}
