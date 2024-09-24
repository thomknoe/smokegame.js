#include <Keyboard.h>

int button2state = 0; 
int tempPrev = -1;

void setup() {
  pinMode(8, INPUT);
  pinMode(2, INPUT_PULLUP);
  Serial.begin(9600);  
  Keyboard.begin();   
}

void loop() {
  int temp = digitalRead(8);  
  Serial.println(temp);       
  delay(100);                 


  if (digitalRead(2) == LOW && button2state == 0 && temp == 1) {
    Keyboard.write(65);       
    button2state = 1;
  }
  if (digitalRead(2) == HIGH) {
    button2state = 0;
  }
}
