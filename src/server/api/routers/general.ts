import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "rbgs/server/api/trpc";

export const generalRouter = createTRPCRouter({
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

  getPrestamosId: publicProcedure
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
                  CeldaItem: {
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
                        {
                          department: {
                            contains: input.search,
                          },
                        },
                      ],
                    },
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

  getPrestamosSearch: publicProcedure
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
                  CeldaItem: {
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
                        {
                          department: {
                            contains: input.search,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          CeldaItem: {
            select: {
              Item: true,
            },
          },
        },
        orderBy: {
          finalDate: input.type === "activo" ? "asc" : "desc",
        },
      });
    }),

  getPrestamosByItem: publicProcedure
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
              CeldaItem: {
                Item: {
                  id: input.id,
                },
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
