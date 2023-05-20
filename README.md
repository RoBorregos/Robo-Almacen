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