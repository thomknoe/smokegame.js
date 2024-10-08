#include <Keyboard.h>

// Pin definitions
const int trigPin = 14;   // Trigger pin for the distance sensor
const int echoPin = 16;   // Echo pin for the distance sensor
const int buttonPin = 10; // Button pin
const int LEDPin = A2;

void setup()
{
  // Initialize the pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP); // Use internal pull-up resistor
  pinMode(LEDPin, OUTPUT);

  // Start the Keyboard
  Keyboard.begin();

  // Start serial communication
  Serial.begin(9600);
}

void loop()
{
  // Read the distance
  long duration, distance;

  // Send a pulse to trigger the sensor
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read the echo pulse duration
  duration = pulseIn(echoPin, HIGH);

  // Calculate the distance in cm
  distance = duration * 0.034 / 2; // Speed of sound is 0.034 cm/µs

  // Map the distance to a PWM value (0-255) for LED brightness
  int brightness = map(distance, 0, 10, 1.000, 0.000); // Closer = brighter, Farther = dimmer
  Serial.println(brightness);

  // Constrain the brightness value to stay within 0-255 range
  brightness = constrain(brightness, 0, 255);

  // Smoothly fade the LED based on distance

  // Check if the distance is less than 15 cm
  if (distance < 16)
  {
    Keyboard.press('g'); // Press 'g'
    analogWrite(LEDPin, 200);
  }
  else
  {
    Keyboard.release('g'); // Release 'g'
    digitalWrite(LEDPin, LOW);
  }

  // Read the button state
  int buttonState = digitalRead(buttonPin);

  if (buttonState == HIGH)
  {                        // Button is pressed
    Keyboard.press('r');   // Press 'r'
    delay(100);            // Press duration
    Keyboard.release('r'); // Release 'r'
  }
  else
  {
    // Print button state to serial
    Serial.println("Button is not pressed");
  }

  delay(50); // Delay for a brief period before the next loop iteration
}
