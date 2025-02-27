import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "rbgs/server/api/trpc";

export const groupRouter = createTRPCRouter({
  createGroup: adminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.group.create({
        data: { name: input.name },
      });
    }),

  deleteGroup: adminProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.group.delete({
        where: { id: input.groupId },
      });
    }),

  assignUserToGroup: adminProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userGroup.create({
        data: { userId: input.userId, groupId: input.groupId },
      });
    }),

  removeUserFromGroup: adminProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userGroup.delete({
        where: {
          userId_groupId: {
            userId: input.userId,
            groupId: input.groupId,
          },
        },
      });
    }),

  getGroups: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany();
  }),

  getUsersInGroup: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.userGroup.findMany({
        where: { groupId: input.groupId },
        include: { user: true },
      });
    }),
});
