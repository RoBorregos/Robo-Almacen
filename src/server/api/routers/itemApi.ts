import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";

export const itemRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany();
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.item.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  // create: protectedProcedure
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string(),
        department: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.item.create({
        data: {
          name: input.name,
          description: input.description,
          category: input.category,
          department: input.department,
        },
      });
    }),

  // update: protectedProcedure
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        category: z.string(),
        department: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.item.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          category: input.category,
          department: input.department,
        },
      });
    }),

  // delete: protectedProcedure
  delete: publicProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.prisma.item.delete({
      where: {
        id: input,
      },
    });
  }),
});
