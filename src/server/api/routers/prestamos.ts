import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  //   publicProcedure,
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
              id: true,
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
        celdaId: z.string(),
        celdaItemId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const celda = await ctx.prisma.celda.findUnique({
        where: {
          id: input.celdaId,
        },
      });

      if (!celda) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No se encontró la celda.",
        });
      }

      await ctx.prisma.celdaItem.update({
        where: {
          id: input.celdaItemId,
        },
        data: {
          quantity: {
            decrement: input.quantity,
          },
        },
      });

      await ctx.prisma.prestamo.create({
        data: {
          itemId: input.id,
          description: input.description,
          quantity: input.quantity,
          userId: ctx.session.user.id,
          celdaId: input.celdaId,
        },
      });

      // TODO: send easy to interpret message to open the cell.
      return (
        "Préstamo creado exitosamente, abra las celda(s): " +
        // openCells.join(", ") +
        " para obtener los items."
      );
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
      const returnCell = await ctx.prisma.celdaItem.findFirst({});

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
          await tx.prestamo.update({
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
      // TODO: send easy to interpret message to open the cell.
      return "La celda fue abierta. Regrese los items y cierre la celda.";
    }),

  issuePrestamo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.prestamo.update({
        where: {
          id: input.id,
        },
        data: {
          issued: true,
        },
      });

      return "Préstamo emitido.";
    }),
});
