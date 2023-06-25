import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";

import {
  UserModel,
  CeldaModel,
  ItemModel,
  CeldaItemModel,
  PrestamoModel,
} from "rbgs/zod/types";

export const testsRouter = createTRPCRouter({
  createUser: publicProcedure.input(UserModel).mutation(({ input, ctx }) => {
    return ctx.prisma.user.create({
      data: {
        ...input,
      },
    });
  }),

  createCelda: publicProcedure.input(CeldaModel).mutation(({ input, ctx }) => {
    return ctx.prisma.celda.create({
      data: {
        ...input,
      },
    });
  }),

  createItem: publicProcedure.input(ItemModel).mutation(({ input, ctx }) => {
    return ctx.prisma.item.create({
      data: {
        ...input,
      },
    });
  }),

  createCeldaItem: publicProcedure
    .input(CeldaItemModel)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.celdaItem.create({
        data: {
          ...input,
        },
      });
    }),

  createPrestamo: publicProcedure
    .input(PrestamoModel)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.prestamo.create({
        data: {
          ...input,
        },
      });
    }),
});
