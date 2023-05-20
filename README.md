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
| Iván Romero | [@IvanRomero03](https://github.com/IvanRomero03) | i.wells.ar@gmail |
| Oscar Arreola | | |
| Diego Hernández | | |
| Alejandra Coeto | | |
| Yaír Reyes | | |
| Leonardo Llanas | | |

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