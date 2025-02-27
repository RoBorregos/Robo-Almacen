// Script used to generate data for tests
import { faker } from "@faker-js/faker";

import {
  type Item,
  Account,
  type Prestamo,
  type User,
  type Celda,
  type CeldaItem,
} from "@prisma/client";

// Functions to generate random objects of each type.

export function generateRandomItem(): Item {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    department: faker.commerce.department(),
    imgPath: "fakePath.jpg",
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  };
}

export function generateRandomUser(): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = firstName + " " + lastName;
  return {
    id: faker.string.uuid(),
    RFID: faker.string.uuid(),
    name: name,
    email: faker.internet.email({ firstName: firstName, lastName: lastName }),
    emailVerified: faker.date.past(),
    image: "none",
    hasData: false,
    role: "USER",
    RFIDtoken: faker.string.uuid(),
  };
}

// Al usar, reasignar celdaItemId y userId a valores válidos.
export function generateRandomPrestamo(): Prestamo {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    initialDate: faker.date.past(),
    finalDate: faker.date.future(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    returned: faker.datatype.boolean(),
    itemId: faker.string.uuid(),
    description: faker.commerce.productDescription(),
    userId: faker.string.uuid(),
    celdaId: faker.string.uuid(),
    issued: faker.datatype.boolean(),
  };
}

export function generateRandomCelda(): Celda {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    name: faker.commerce.productName(),
    row: faker.number.int({ min: 1, max: 10 }),
    column: faker.number.int({ min: 1, max: 10 }),
  };
}

export function generateRandomCeldaItem(): CeldaItem {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    celdaId: faker.string.uuid(),
    itemId: faker.string.uuid(),
  };
}

// Registra un usuario y crea lo necesario para generar un pedido
// Agrega todo a la base de datos.
// export async function generateNPrestamos(n: number, createUser: any, createCelda: any, createItem: any, createCeldaItem: any, createPrestamo: any) {

//   // Agregar prestamos a un usuario
//   const user = generateRandomUser();

//   await createUser(user);

//   for (let i = 0; i < n; i++) {
//     const celda = generateRandomCelda();
//     const item = generateRandomItem();

//     const celdaItem = generateRandomCeldaItem();
//     celdaItem.celdaId = celda.id;
//     celdaItem.itemId = item.id;

//     const prestamo = generateRandomPrestamo();
//     prestamo.userId = user.id;

//     await createItem(item);
//     await createCelda(celda);
//     await createCeldaItem(celdaItem);
//     await createPrestamo(prestamo);
//   }
//   console.log("Función generateNPrestamos ejecutada!");
// }
