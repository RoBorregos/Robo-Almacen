import { createTRPCRouter } from "rbgs/server/api/trpc";
import { exampleRouter } from "rbgs/server/api/routers/example";
import { itemsRouter } from "./routers/items";
import { testsRouter } from "./routers/tests";
import { prestamosRouter } from "./routers/prestamos";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  items: itemsRouter,
  tests: testsRouter,
  prestamos: prestamosRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
