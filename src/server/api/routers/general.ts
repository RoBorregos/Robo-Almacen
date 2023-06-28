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
});
