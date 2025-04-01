import { createTRPCRouter } from "rbgs/server/api/trpc";
import { exampleRouter } from "rbgs/server/api/routers/example";
import { itemsRouter } from "./routers/items";
import { testsRouter } from "./routers/tests";
import { prestamosRouter } from "./routers/prestamos";
import { celdaRouter } from "rbgs/server/api/routers/celdaApi";
import { itemRouter } from "rbgs/server/api/routers/itemApi";
import { userDataRouter } from "./routers/userData";
import { groupRouter } from "./routers/group";
import { lockerRouter } from "./routers/locker";
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
  prestamos: prestamosRouter,
  items: itemsRouter,
  tests: testsRouter,
  group: groupRouter,
  locker: lockerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
