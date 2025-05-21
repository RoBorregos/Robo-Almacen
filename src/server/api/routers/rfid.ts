import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { WebSocket } from "ws";

import { createTRPCRouter, protectedProcedure } from "rbgs/server/api/trpc";
import { env } from "rbgs/env.mjs";

export const rfidRouter = createTRPCRouter({
  getRfid: protectedProcedure.mutation(async () => {
    const rfid = await getRfid();

    if (typeof rfid === "string") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: rfid,
      });
    }
    return rfid.token;
  }),
});

export const getRfid = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  try {
    const response = await fetch(`${env.RFID_SERVER}/read-rfid`, {
      method: "GET",
      signal: controller.signal,
    });

    if (!response.ok) {
      return "No se pudo leer el RFID.";
    }

    const schema = z.object({
      token: z.string(),
    });

    return schema.parse(await response.json());
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return "Timeout al leer el RFID.";
    }
    return "Error al leer el RFID.";
  } finally {
    clearTimeout(timeoutId);
  }
};
