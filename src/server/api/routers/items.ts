import { z } from "zod";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";
import { PrismaClient } from "@prisma/client";

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

  getItemsInUsersGroup: protectedProcedure
    .input(z.object({ search: z.string(), userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = input.userId;

      // Fetch groups the user belongs to
      const userGroups = await ctx.prisma.userGroup.findMany({
        where: { userId },
        select: { groupId: true },
      });

      const groupIds = userGroups.map((g) => g.groupId);

      // Fetch celdas that belong to these groups
      const celdasInGroups = await ctx.prisma.celdaGroup.findMany({
        where: {
          groupId: { in: groupIds },
        },
        select: { celdaId: true },
      });

      const celdaIds = celdasInGroups.map((cg) => cg.celdaId);

      // Fetch available items in those celdas
      const items = await ctx.prisma.item.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: input.search } },
                { description: { contains: input.search } },
                { category: { contains: input.search } },
              ],
            },
            {
              CeldaItem: {
                some: { celdaId: { in: celdaIds } },
              },
            },
          ],
        },
        select: {
          id: true,
        },
      });

      // Filter out items that are out of stock
      const asyncRes = await asyncFilter(items, async (item) => {
        const count = await getItemCount(item.id, ctx.prisma);
        return count > 0;
      });

      return asyncRes;
    }),
});

const getItemCount = async (id: string, db: PrismaClient) => {
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

const asyncFilter = async (
  arr: { id: string }[],
  predicate: (obj: { id: string }) => Promise<boolean>
) => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
};
