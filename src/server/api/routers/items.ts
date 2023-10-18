import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAllItems: publicProcedure.query(({ ctx }) => {
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

  getItemsId: publicProcedure
    .input(z.object({ search: z.string() }))
    .query(({ input, ctx }) => {
      if (input.search === "") {
        return ctx.prisma.item.findMany({
          select: {
            id: true,
          },
        });
      }

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

  getItemById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.item.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getItemsSearch: publicProcedure
    .input(z.object({ search: z.string() }))
    .query(({ input, ctx }) => {
      if (input.search === "") {
        return ctx.prisma.item.findMany({});
      }

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
  getItemCounts: publicProcedure
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
            {
              Prestamo: {
                none: {},
              },
            },
          ],
        },
      });

      let availableCount = 0;

      availableItems?.forEach((item) => {
        availableCount += item.quantity;
      });

      const prestados = totalCount - availableCount;

      const itemsPrestados = await ctx.prisma.celdaItem.findMany({
        where: {
          AND: [
            {
              itemId: input.id,
            },
            {
              Prestamo: {
                some: {},
              },
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
});
