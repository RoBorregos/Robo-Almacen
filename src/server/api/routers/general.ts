import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";

export const generalRouter = createTRPCRouter({
  getAllItems: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany();
  }),

  getAllItemsIds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany({
      select: {
        id: true,
      },
    });
  }),

  getItemById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.item.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getPrestamoById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.prestamo.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getActivePrestamos: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.prestamo.findMany({
      where: {
        returned: false,
      },
      select: {
        id: true,
      },
    });
  }),

  getHistoryPrestamos: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.prestamo.findMany({
      where: {
        returned: true,
      },
      select: {
        id: true,
      },
    });
  }),

  getPrestamoDetailsById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.prestamo.findUnique({
        where: {
          id: input.id,
        },
        include: {
          CeldaItem: {
            select: {
              Item: true,
            },
          },
        },
      });
    }),
});
