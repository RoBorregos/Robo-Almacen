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

});
