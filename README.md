# Robo-Almacen
Pagina Web de Almacén IoT 

# Description
Almacén IoT (IoT Wharehouse) is an IoT System for the managment, control and monitoring of the materials in the RoBorregos Lab. It is composed of a web application, a hardware system, and a WebSocket's Server.

# Tech Stack
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/en/)
- [NextAuth.js](https://next-auth.js.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/)
- [Formik](https://formik.org/)

# Installation
1. Clone the repository
```bash
git clone https://github.com/RoBorregos/Robo-Almacen.git
```

2. Go to the project directory
```bash
cd Robo-Almacen
```

3. Create a `.env` file in the root directory of the project and add the following environment variables
```bash
cp .env.example .env
```
(Or just make sure that the `.env` file is in the root directory)

1. Install dependencies
```bash
npm install
```

1. Pull the latest changes from the Database
```bash
npx prisma db pull
```

5. Run the development server
```bash
npm run dev
```

# Development Team

| Name | Github | Email |
| --- | --- | --- |
| Iván Romero | [@IvanRomero03](https://github.com/IvanRomero03) | i.wells.ar@gmail.com |
| Oscar Arreola | | |
| Diego Hernández | | |
| Alejandra Coeto | | |
| Yaír Reyes | | |
| Leonardo Llanas | | |
| Gilberto Malagamba | [@GilMM27](https://github.com/GilMM27) | gilberto.malagamba@gmail.com |

# Proyect structure

```bash
├─ prisma
│   └─ schema.prisma
│
├─ public
│   ├── favicon.ico
│   └── images
│
└─ src
    ├─ components
    ├─ pages
    │   └─ api
    │       ├─ auth
    │       └─ trpc
    │
    ├─ server
    │   └─ api
    │       └─ routers
    │
    ├─ styles
    │
    └─ utils
```

# Testing websocket

First, on the root of this project run: 
```bash 
npm run dev
``` 
Then on vscode forward the port that is hosting the web page (commonly 3000) and change the visibility to public. Add the respective Endpoint URLs on aws WebSocket Routes, for example: https://something.devtunnels.ms/api/websocket/connect

Use https://piehost.com/websocket-tester and connect to the WebSocket link, for example: wss://something.execute-api.us-east-2.amazonaws.com/development/

Try sending a JSON such as *{ "data": "", "action": "getPrestamos","id": "RFID" }* and expect a response like *{"status":"Success","data":[]}*

If there are préstamos in the database then it will return an array like *{"status":"Success","data":[{"User":{"name":"Gilberto Malagamba Montejo"},"Item":{"name":"a"},"Celda":{"name":"d","column":0,"row":0},"id":"cm1zrg9l7000kes8epm8d74ya"}]}*

In the arduino code, we use the following function to send that message:

wsClient.sendResponse("", "getPrestamos", "RFID"); // Data Action Id

In the following table there are all the examples of actions

| Message | Response |
| --- | --- |
| { "data": "", "action": "getPrestamos", "id": "RFID" } | {"status":"Success","data":[{"User":{"name":"UserName"},"Item":{"name":"ItemName"},"Celda":{"name":"CeldaName","column":#,"row":#},"id":"Id"}]} |
| { "data": "", "action": "getIssuedPrestamos", "id": "RFID" } | {"status":"Success","data":[{"User":{"name":"UserName"},"Item":{"name":"ItemName"},"Celda":{"name":"CeldaName","column":#,"row":#},"id":"Id"}]} |
| { "data": "RFIDtoken,prestamoId", "action": "issuePrestamo", "id": "RFID" } |  {"status":"Success","data":"Prestamo issued"} |
| { "data": "RFIDtoken,prestamoId", "action": "returnPrestamo", "id": "RFID" } | {"status":"Success","data":"Prestamo returned"}

# Testing database

Run a local instance of mysql or similar provider and add the route to url in the shema.prisma file. *Suggestion: Try using xampp.*

datasource db {
  provider = "mysql"
  url      = "mysql://root:@localhost:3306/AlmacenLocal"
}

To open the database ui interface run:
```bash
npx prisma studio
```
To test a new schema.prisma kill *next dev* and *prisma studio* and run:
```bash
npx prisma migrate dev
npx prisma generate
```
