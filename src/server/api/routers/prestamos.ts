import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";

export const prestamosRouter = createTRPCRouter({
  getPrestamosId: protectedProcedure
    .input(z.object({ search: z.string(), type: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.prestamo.findMany({
        where: {
          AND: [
            {
              returned: input.type === "activo" ? false : true,
            },
            {
              userId: ctx.session.user.id,
            },
            {
              OR: [
                {
                  id: {
                    contains: input.search,
                  },
                },
                {
                  Item: {
                    OR: [
                      {
                        name: {
                          contains: input.search,
                        },
                      },
                      {
                        description: {
                          contains: input.search,
                        },
                      },
                      {
                        category: {
                          contains: input.search,
                        },
                      },
                      {
                        department: {
                          contains: input.search,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
        },
        orderBy: {
          finalDate: input.type === "activo" ? "asc" : "desc",
        },
      });
    }),

  getPrestamoDetailsById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.prestamo.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Item: true,
          User: {
            select: {
              name: true,
            },
          },
        },
      });
    }),

  getPrestamosSearch: protectedProcedure
    .input(z.object({ search: z.string(), type: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.prestamo.findMany({
        where: {
          AND: [
            {
              returned: input.type === "activo" ? false : true,
            },
            {
              OR: [
                {
                  id: {
                    contains: input.search,
                  },
                },
                {
                  Item: {
                    OR: [
                      {
                        name: {
                          contains: input.search,
                        },
                      },
                      {
                        description: {
                          contains: input.search,
                        },
                      },
                      {
                        category: {
                          contains: input.search,
                        },
                      },
                      {
                        department: {
                          contains: input.search,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        include: {
          Item: true,
        },
        orderBy: {
          finalDate: input.type === "activo" ? "asc" : "desc",
        },
      });
    }),

  getPrestamosByItem: protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
        includeReturned: z.boolean().nullable(),
      })
    )
    .query(({ input, ctx }) => {
      if (input.id === undefined || input.id === null) {
        return undefined;
      }

      return ctx.prisma.prestamo.findMany({
        where: {
          AND: [
            {
              Item: {
                id: input.id,
              },
            },

            input.includeReturned
              ? {}
              : {
                  returned: false,
                },
          ],
        },
        orderBy: {
          finalDate: "desc",
        },

        include: {
          User: true,
        },
      });
    }),

  // Choose cells that have more items of the requested one.
  createPrestamo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const celdaItem = await ctx.prisma.celdaItem.findMany({
        where: {
          AND: [
            {
              Item: {
                id: input.id,
              },
            },
            {
              quantity: {
                gte: 0,
              },
            },
          ],
        },
        orderBy: {
          quantity: "asc",
        },
      });

      if (input.quantity < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "La cantidad debe ser mayor a 0.",
        });
      }
      if (celdaItem.length === 0 && celdaItem != undefined) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No hay items disponibles.",
        });
      }

      // Check if there are enough items available.
      let availableCount = 0;

      celdaItem.map((item) => {
        availableCount += item.quantity;
      });

      if (availableCount < input.quantity) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No hay suficientes items disponibles.",
        });
      }

      let remainingQuantity = input.quantity;
      const openCells: string[] = [];

      // Update the quantity of the items in the cells.
      // Use transaction to ensure that all the updates are done or failed.
      await ctx.prisma.$transaction(async (tx) => {
        for (let i = 0; i < celdaItem.length && remainingQuantity > 0; i++) {
          const item = celdaItem[i];
          if (!item) continue;
          openCells.push(item.celdaId);
          if (item.quantity >= remainingQuantity) {
            await tx.celdaItem.update({
              where: {
                id: item.id,
              },
              data: {
                quantity: item.quantity - remainingQuantity,
              },
            });

            remainingQuantity = 0;
          } else {
            await tx.celdaItem.update({
              where: {
                id: item.id,
              },
              data: {
                quantity: 0,
              },
            });

            remainingQuantity -= item.quantity;
          }
        }

        await tx.prestamo.create({
          data: {
            itemId: input.id,
            description: input.description,
            quantity: input.quantity,
            userId: ctx.session.user.id,
          },
        });
        // Open cells stored in openCells.
        // open(openCells);
      });

      return "Préstamo creado exitosamente.";
    }),
  returnPrestamo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const prestamo = await ctx.prisma.prestamo.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Item: true,
        },
      });

      if (!prestamo) {
        return "No se encontró el prestamo.";
      }

      if (prestamo.returned) {
        return "Error: el préstamo ya fue devuelto.";
      }

      // Check cells that have the item. Return the item to the cell that has the most of the same item
      // and that has space to store the item.

      const celdaItem = await ctx.prisma.celdaItem.findFirst({
        where: {
          Item: {
            id: prestamo.Item.id,
          },
        },
        orderBy: {
          quantity: "desc",
        },
      });

      // Select a random cell.
      let returnCell = await ctx.prisma.celdaItem.findFirst({});

      if (celdaItem) {
        // Store the items in the cell that has the most of the returned item.
        await ctx.prisma.$transaction(async (tx) => {
          await tx.celdaItem.update({
            where: {
              id: celdaItem.id,
            },
            data: {
              quantity: celdaItem.quantity + prestamo.quantity,
            },
          });
          await ctx.prisma.prestamo.update({
            where: {
              id: prestamo.id,
            },
            data: {
              returned: true,
            },
          });
        });

        // Open cell
        // open(celdaItem.celdaId);
      } else if (!celdaItem && returnCell) {
        // Store the items in the first available cell.

        await ctx.prisma.$transaction(async (tx) => {
          await tx.celdaItem.update({
            where: {
              id: returnCell?.id,
            },
            data: {
              quantity: (returnCell?.quantity ?? 0) + prestamo.quantity,
            },
          });
          tx.prestamo.update({
            where: {
              id: input.id,
            },
            data: {
              returned: true,
            },
          });
        });
        // Open cell
        // open(celdaItem.celdaId);
      } else if (!celdaItem && !returnCell) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No hay ninguna celda disponible para regresar el pedido.",
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inesperado.",
        });
      }

      return "La celda fue abierta y el prestamo fue devuelto exitosamente.";
    }),
});
