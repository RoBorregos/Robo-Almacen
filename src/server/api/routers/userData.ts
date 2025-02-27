import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "rbgs/server/api/trpc";

export const userDataRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        major: z.string(),
        semester: z.number(),
        area: z.string(),
        phone: z.string(),
        image: z.string(),
        userId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userData.create({
        data: {
          major: input.major,
          semester: input.semester,
          area: input.area,
          phone: input.phone,
          image: input.image,
          User: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        major: z.string(),
        semester: z.number(),
        area: z.string(),
        phone: z.string(),
        image: z.string(),
        userId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.userId,
        },

        data: {
          UserData: {
            update: {
              major: input.major,
              semester: input.semester,
              area: input.area,
              phone: input.phone,
              image: input.image,
            },
          },
        },
      });
    }),

  updateHasData: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          hasData: true,
        },
      });
    }),

  hasData: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input.userId,
        },
        select: {
          hasData: true,
        },
      });
    }),

  getUserData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.userData.findFirst({
        where: {
          User: {
            id: input.id,
          },
        },
      });
    }),

  getUserIds: adminProcedure
    .input(z.object({ search: z.string().nullable() }))
    .query(({ input, ctx }) => {
      if (!input.search) input.search = "";

      return ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.search,
              },
            },
            {
              email: {
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

  getUserInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
