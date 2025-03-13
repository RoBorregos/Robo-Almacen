import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";

export const celdaRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.celda.findMany();
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.celda.findUnique({
        where: {
          id: input.id,
        },
        include: {
          CeldaItem: true,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        row: z.number(),
        column: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.celda.create({
        data: {
          name: input.name,
          row: input.row,
          column: input.column,
        },
      });
    }),

  // update: protectedProcedure
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        row: z.number(),
        column: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.celda.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          row: input.row,
          column: input.column,
        },
      });
    }),

  // delete: protectedProcedure
  delete: publicProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.prisma.celda.delete({
      where: {
        id: input,
      },
    });
  }),

  addItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
        itemId: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.celdaItem.create({
        data: {
          celdaId: input.id,
          itemId: input.itemId,
          quantity: input.quantity,
        },
      });
    }),

  removeItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.celdaItem.delete({
        where: {
          id: input.id,
        },
      });
    }),

  updateItemQuantity: publicProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.celdaItem.update({
        where: {
          id: input.id,
        },
        data: {
          quantity: input.quantity,
        },
      });
    }),

  getCeldasWithItemId: publicProcedure
    .input(
      z.object({
        itemId: z.string(),
        amount: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.celdaItem.findMany({
        where: {
          itemId: input.itemId,
          quantity: {
            gte: input.amount,
          },
        },
        include: {
          Celda: true,
        },
      });
    }),
});
