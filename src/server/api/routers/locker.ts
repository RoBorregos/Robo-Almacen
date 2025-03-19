import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  localProcedure,
} from "rbgs/server/api/trpc";

export const lockerRouter = createTRPCRouter({

  /*
 *  IN: column and row identifier
 *  OUT: status as http code 
 */
  selectOpen: localProcedure
    .input(
      z.object({
        x: z.string(),
        y: z.string(),
      })
    )
    .query(({ input, ctx }) => {
    // Zod & TRPC should guarantee valid input
    
        // Use websocket comms here and return
        // status code from ESP32 reply
        return `OK, (${input.x},${input.y})`;

    }),
});
