#include "Websockets.h"

Websockets* Websockets::instance = nullptr; // allocate static member

Websockets::Websockets(String host, int port, String path, bool debug)
{
    this->host = host;
    this->port = port;
    this->path = path;
    this->debug = debug;
    Websockets::instance = this; // set static instance pointer
}

void Websockets::initialize()
{
    this->client.beginSSL(host, port, path);
    this->client.onEvent(Websockets::webSocketEvent); // bind static handler
    this->client.setReconnectInterval(5000);
}

void Websockets::loop()
{
    this->client.loop();
}

void Websockets::webSocketEvent(WStype_t type, uint8_t * payload, size_t length)
{
    switch (type) {
      case WStype_CONNECTED:
        Serial.println("Connected to WebSocket server!");
        break;
      case WStype_TEXT: {
        const int openTime = 5000; // Close solenoid after the time has passed.
        const int localColumn = 1;  // This ESP32 is column 1
        const int solenoids[] = {5, 18, 19, 21};
        const int numLockers = sizeof(solenoids) / sizeof(solenoids[0]);
        Serial.printf("Message received: %s\n", payload);
        DynamicJsonDocument doc(1024);
        DeserializationError err = deserializeJson(doc, payload);

        // Checar si hubo un error
        if (err)
        {
            Serial.print(F("deserializeJson() failed with code "));
            Serial.println(err.c_str());
            Serial.println("Aborted action");
            return;
        }
        else
        {
            // Imprimir el mensaje
            serializeJson(doc, Serial);
            Serial.println();
        }


        if (!doc.containsKey("x") || !doc.containsKey("y")) return;

        int x = doc["x"];
        int y = doc["y"];

        Serial.printf("Received x=%d, y=%d\n", x, y);

        if (x == 1) {
                      if (y < 0 || y >= numLockers) {
                  Serial.println("Invalid locker index");
                  return;
              }

              Serial.printf("Open solenoid #%d\n", y);
              int pin = solenoids[y];
              digitalWrite(pin, HIGH);
              delay(openTime);
              digitalWrite(pin, LOW);
        } else {
            Serial.println("Message not for this column");
        }
        break;
      }
      case WStype_DISCONNECTED:
        Serial.println("WebSocket disconnected");
        break;
      default:
        break;
    }
}


