import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  memberProcedure,
  adminProcedure,
  localProcedure,
} from "rbgs/server/api/trpc";
export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .query(({ ctx }) => {
      return {
        greeting: `Hello ${ctx.address}`,
      };
    }),

  crear: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.example.create({
        data: {
          name: input.name,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    return "you can now see this secret message!";
  }),

  getMemberMessage: memberProcedure.query(({ ctx: _ctx }) => {
    return "you are a member!";
  }),

  getAdminMessage: adminProcedure.query(({ ctx: _ctx }) => {
    return "you are an admin!";
  }),

  getLocalMessage: localProcedure.query(({ctx: _ctx}) =>
  {
	  return "we share the house!";
  }),

});
