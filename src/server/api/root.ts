import { createTRPCRouter } from "rbgs/server/api/trpc";
import { exampleRouter } from "rbgs/server/api/routers/example";
import { celdaRouter } from "rbgs/server/api/routers/celdaApi";
import { itemRouter } from "rbgs/server/api/routers/itemApi";
import { userDataRouter } from "./routers/userData";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  celda: celdaRouter,
  item: itemRouter,
  userData: userDataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
