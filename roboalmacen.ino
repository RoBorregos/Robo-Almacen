#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

const char* ssid = "RoBorregos2";
const char* password = "RoBorregos2024";

//variabls for blinking an LED with Millis
const int Locker1 = 25; // ESP32 Pin to which onboard LED is connected
const int Locker2 = 26; // ESP32 Pin to which onboard LED is connected
const int Locker3 = 32; // ESP32 Pin to which onboard LED is connected
const int Locker4 = 33; // ESP32 Pin to which onboard LED is connected
unsigned long previousMillis = 0;  // will store last time LED was updated
const long interval = 3000;  // interval at which to blink (milliseconds)
int count = 0;


void start_ota_update(){
Serial.println("Booting");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }
    ArduinoOTA.setPassword("almacen2024");
  ArduinoOTA
    .onStart([]() {
      String type;
      if (ArduinoOTA.getCommand() == U_FLASH)
        type = "sketch";
      else // U_SPIFFS
        type = "filesystem";

      // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
      Serial.println("Start updating " + type);
    })
    .onEnd([]() {
      Serial.println("\nEnd");
    })
    .onProgress([](unsigned int progress, unsigned int total) {
      Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    })
    .onError([](ota_error_t error) {
      Serial.printf("Error[%u]: ", error);
      if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
      else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
      else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
      else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
      else if (error == OTA_END_ERROR) Serial.println("End Failed");
    });

  ArduinoOTA.begin();
  Serial.println("Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}



void setup() {
  Serial.begin(115200);
  start_ota_update();
  pinMode(Locker1, OUTPUT);
  pinMode(Locker2, OUTPUT);
  pinMode(Locker3, OUTPUT);
  pinMode(Locker4, OUTPUT);


}

void loop() {
  ArduinoOTA.handle();
  // unsigned long currentMillis = millis();
  
  // if(currentMillis - previousMillis >= interval) {
  //   switch (count)
  //   {
  //   case 0:
  //     digitalWrite(Locker1,HIGH);
  //     break;
  //   case 1:
  //     digitalWrite(Locker1,LOW);
  //     break;
  //   case 2:
  //     digitalWrite(Locker2,HIGH);
  //     break;
  //   case 3:
  //     digitalWrite(Locker2,LOW);
  //     break;
  //   case 4:
  //     digitalWrite(Locker3,HIGH);
  //     break;
  //   case 5:
  //     digitalWrite(Locker3,LOW);
  //     break;
  //   case 6:
  //     digitalWrite(Locker4,HIGH);
  //     break;
  //   case 7:
  //     digitalWrite(Locker4,LOW);
  //     count = -1;
  //     break;

  //   }
  // // save the last time you blinked the LED
  // count += 1;
  // previousMillis = currentMillis;
  // // if the LED is off turn it on and vice-versa:
  // }

}