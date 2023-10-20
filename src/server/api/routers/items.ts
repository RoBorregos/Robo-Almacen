import { z } from "zod";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAllItems: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });
  }),

  getItemsId: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.item.findMany({
        where: {
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
        select: {
          id: true,
        },
      });
    }),

  getItemById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.item.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getItemsSearch: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.item.findMany({
        where: {
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
      });
    }),
  getItemCounts: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const allRelatedItems = await ctx.prisma.celdaItem.findMany({
        where: {
          itemId: input.id,
        },
        select: {
          quantity: true,
        },
      });

      let totalCount = 0;

      allRelatedItems?.forEach((item) => {
        totalCount += item.quantity;
      });

      const availableItems = await ctx.prisma.celdaItem.findMany({
        where: {
          AND: [
            {
              itemId: input.id,
            },
          ],
        },
      });

      let availableCount = 0;

      availableItems?.forEach((item) => {
        availableCount += item.quantity;
      });

      // const prestados = totalCount - availableCount;

      const itemsPrestados = await ctx.prisma.celdaItem.findMany({
        where: {
          AND: [
            {
              itemId: input.id,
            },
          ],
        },
      });

      let prestadosCount = 0;

      itemsPrestados?.forEach((item) => {
        prestadosCount += item.quantity;
      });

      return {
        totalCount,
        availableCount,
        prestadosCount,
      };
    }),

  getItemAvailableCount: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const celdas = await ctx.prisma.celdaItem.findMany({
        where: {
          itemId: input.id,
        },
        select: {
          quantity: true,
        },
      });

      let availableCount = 0;
      celdas.forEach((celda) => {
        availableCount += celda.quantity;
      });

      return availableCount;
    }),
});
