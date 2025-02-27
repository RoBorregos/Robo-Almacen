import { z } from "zod";

// TODO: check for autogenerators given schema. E.g zod-prisma

// Todo: Account, Session User2, Telemetry
// Implemented: User, Celda, Item, CeldaItem, Prestamo

export const UserModel = z.object({
  id: z.string(),
  name: z.coerce.string().nullable(),
  email: z.coerce.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().or(z.null()),
});

export const CeldaModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  row: z.number(),
  column: z.number(),
});

export const ItemModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  imgPath: z.string(),
});

export const CeldaItemModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  quantity: z.number(),
  available: z.number(),
  celdaId: z.string(),
  itemId: z.string(),
});

export const PrestamoModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  initialDate: z.date(),
  finalDate: z.date().nullable(),
  quantity: z.number(),
  returned: z.boolean(),
  celdaItemId: z.string(),
  userId: z.string(),
});
