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
      });
    }),

  // create: protectedProcedure
  create: publicProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.prisma.celda.create({
      data: {
        name: input,
      },
    });
  }),

  // update: protectedProcedure
  update: publicProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.celda.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
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
});
