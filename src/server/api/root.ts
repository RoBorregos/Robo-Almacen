import { createTRPCRouter } from "rbgs/server/api/trpc";
import { exampleRouter } from "rbgs/server/api/routers/example";
import { generalRouter } from "./routers/general";
import { testsRouter } from "./routers/tests";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  general: generalRouter,
  tests: testsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
