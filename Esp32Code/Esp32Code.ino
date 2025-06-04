#include "config.h"
#include "Websockets.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoOTA.h>

// Control variable for solenoid
const int openTime = 5000; // Close solenoid after the time has passed.
const int localColumn = 1;  // This ESP32 is column 1
const int solenoids[] = {5, 18, 19, 21};
const int numLockers = sizeof(solenoids) / sizeof(solenoids[0]);


Websockets wsClient(config::host, config::port, config::path, true);

// //Open servo, considering the specified variables

// void handleLockerOpen(int lockerIndex, int duration) 
// {
//     if (lockerIndex < 0 || lockerIndex >= numLockers) {
//         Serial.println("Invalid locker index");
//         return;
//     }

//     Serial.printf("Open solenoid #%d\n", lockerIndex);
//     int pin = solenoids[lockerIndex];
//     digitalWrite(pin, HIGH);
//     delay(duration);
//     digitalWrite(pin, LOW);
// }


// void onWebSocketMessage(WebsocketsMessage message)
// {
//     DynamicJsonDocument doc(1024);
//     DeserializationError err = deserializeJson(doc, message.data());

//     // Checar si hubo un error
//     if (err)
//     {
//         Serial.print(F("deserializeJson() failed with code "));
//         Serial.println(err.c_str());
//         Serial.println("Aborted action");
//         return;
//     }
//     else
//     {
//         // Imprimir el mensaje
//         serializeJson(doc, Serial);
//         Serial.println();
//     }


//     if (!doc.containsKey("x") || !doc.containsKey("y")) return;

//     int x = doc["x"];
//     int y = doc["y"];

//     Serial.printf("Received x=%d, y=%d\n", x, y);

//     if (x == localColumn) {
//         handleLockerOpen(y, openTime);
//     } else {
//         Serial.println("Message not for this column");
//     }
// }

void setup()
{
    Serial.begin(config::serialBaud);

    while (!Serial) { }

    delay(2000);

    Serial.println("Serial communication initialized.");

    // Set solenoid pins to output
    for (int i = 0; i < numLockers; i++) {
        pinMode(solenoids[i], OUTPUT);
        digitalWrite(solenoids[i], LOW); // Default Value
    }

    Serial.println("Actuator initialization done.");

    // Connect to wifi
    WiFi.begin(config::ssid, config::password);

    // Wait until device is connected
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print("Wifi not connected. Status: ");
        Serial.println(WiFi.status());
        delay(500);
    }

    Serial.println("Wifi has been connected");
    delay(1000);

    // run callback when messages are received
    wsClient.initialize();
    // wsClient.onMessage(onWebSocketMessage);

    Serial.println("Setup has been finished");


     ArduinoOTA.setPassword("RoBoalmacen2025");

  // Password can be set with it's md5 value as well
  // MD5(admin) = 21232f297a57a5a743894a0e4a801fc3
  // ArduinoOTA.setPasswordHash("21232f297a57a5a743894a0e4a801fc3");

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
}

void loop()
{
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected");
        delay(1000);
        return;
    }

    delay(250);
    // Listen for events
    wsClient.loop();
    ArduinoOTA.handle();
}
