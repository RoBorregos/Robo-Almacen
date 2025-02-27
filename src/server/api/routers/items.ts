import { z } from "zod";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";
import { Prisma, PrismaClient } from "@prisma/client";

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

  getAvailableItemIds: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ input, ctx }) => {
      const items = await ctx.prisma.item.findMany({
        where: {
          AND: [
            {
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
          ],
        },
        select: {
          id: true,
        },
      });

      const asyncRes = await asyncFilter(
        items,
        async (item: { id: string }) => {
          const count = await getItemCount(item.id, ctx.prisma);
          return count > 0;
        }
      );

      return asyncRes;
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
      return await getItemCount(input.id, ctx.prisma);
    }),

    getMaxLockerItemCount: protectedProcedure
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

      let maxCount = 0;

      allRelatedItems?.forEach((item) => {
        maxCount = maxCount < item.quantity ? item.quantity : maxCount;
      });

      return maxCount;
    }),
});

const getItemCount = async (
  id: string,
  db: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  const celdas = await db.celdaItem.findMany({
    where: {
      itemId: id,
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
};

const asyncFilter = async (arr: { id: string }[], predicate: (obj: { id: string }) => Promise<boolean>) => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
};
