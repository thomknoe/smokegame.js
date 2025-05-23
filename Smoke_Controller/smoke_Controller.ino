#include <Keyboard.h>

const int trigPin = 14;
const int echoPin = 16;
const int buttonPin = 10;
const int LEDPin = A2;

void setup()
{
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(LEDPin, OUTPUT);

  Keyboard.begin();

  Serial.begin(9600);
}

void loop()
{
  long duration, distance;

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);

  distance = duration * 0.034 / 2;

  int brightness = map(distance, 0, 10, 1.000, 0.000);
  Serial.println(brightness);

  brightness = constrain(brightness, 0, 255);

  if (distance < 16.5)
  {
    Keyboard.press('g');
    analogWrite(LEDPin, 200);
  }
  else
  {
    Keyboard.release('g');
    digitalWrite(LEDPin, LOW);
  }

  int buttonState = digitalRead(buttonPin);

  if (buttonState == HIGH)
  {
    Keyboard.press('r');
    delay(100);
    Keyboard.release('r');
  }
  else
  {
    Serial.println("Button is not pressed");
  }

  delay(50);
}
