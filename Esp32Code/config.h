#ifndef CONFIG_H
#define CONFIG_H

namespace config
{
    static const int serialBaud = 115200;
    // Enter SSID
    static const char *ssid = "Roborregos";
    // // Enter Password
    static const char *password = "RoBorregos2025";
    // Enter server adress
    // static const char *websockets_connection_string = "wss://echo.websocket.org";
    static const char* host = "728b168mc5.execute-api.us-east-2.amazonaws.com";
    static const int port = 443;
    const char* path = "/development/";    
};

#endif