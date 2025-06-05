#ifndef WEBSOCKETS_H
#define WEBSOCKETS_H

#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>

class Websockets
{
  private:
      WebSocketsClient client;
      String host;
      int port;
      String path;
      bool debug;

      static Websockets* instance; // <-- static instance pointer

      static void webSocketEvent(WStype_t type, uint8_t * payload, size_t length); // static handler

  public:
      Websockets(String host, int port, String path, bool debug = false);
      void initialize();
      void loop();
};
#endif
