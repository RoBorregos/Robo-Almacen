// Script used to generate data for tests

import { api } from "rbgs/utils/api";

import { faker } from "@faker-js/faker";

import {
  Item,
  Account,
  Prestamo,
  User,
  Celda,
  CeldaItem,
} from "@prisma/client";

// Functions to generate random objects of each type.

function generateRandomItem(): Item {
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

function generateRandomUser(): User {
  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();
  let name = firstName + " " + lastName;
  return {
    id: faker.string.uuid(),
    name: name,
    email: faker.internet.email({ firstName: firstName, lastName: lastName }),
    emailVerified: faker.date.past(),
    image: "none",
  };
}

// Al usar, reasignar celdaItemId y userId a valores válidos.
function generateRandomPrestamo(): Prestamo {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    initialDate: faker.date.past(),
    finalDate: faker.date.future(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    returned: faker.datatype.boolean(),
    celdaItemId: faker.string.uuid(),
    userId: faker.string.uuid(),
  };
}

function generateRandomCelda(): Celda {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    name: faker.commerce.productName(),
    row: faker.number.int({ min: 1, max: 10 }),
    column: faker.number.int({ min: 1, max: 10 }),
  };
}

function generateRandomCeldaItem(): CeldaItem {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    available: faker.number.int({ min: 1, max: 5 }),
    celdaId: faker.string.uuid(),
    itemId: faker.string.uuid(),
  };
}

// Registra un usuario y crea lo necesario para generar un pedido
// Agrega todo a la base de datos.
export async function generateNPrestamos(n: number, createUser: any, createCelda: any, createItem: any, createCeldaItem: any, createPrestamo: any) {

  // Agregar prestamos a un usuario
  const user = generateRandomUser();

  await createUser(user);

  for (let i = 0; i < n; i++) {
    const celda = generateRandomCelda();
    const item = generateRandomItem();

    const celdaItem = generateRandomCeldaItem();
    celdaItem.celdaId = celda.id;
    celdaItem.itemId = item.id;

    const prestamo = generateRandomPrestamo();
    prestamo.celdaItemId = celdaItem.id;
    prestamo.userId = user.id;

    await createItem(item);
    await createCelda(celda);
    await createCeldaItem(celdaItem);
    await createPrestamo(prestamo);
  } 
  console.log("Función generateNPrestamos ejecutada!");
}
