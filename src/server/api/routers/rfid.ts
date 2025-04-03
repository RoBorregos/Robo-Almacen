import { publicProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const rfidRouter = createTRPCRouter({
  readToken: publicProcedure.mutation(async () => {
    // Send a request to the Raspberry Pi (via HTTP or WebSocket)
    const response = await fetch("http://raspberrypi.local:5000/read-rfid");

    // return schema.parse(await response.json());
    const data = z
      .object({
        token: z.string(),
      })
      .parse(await response.json());

    // Verify token
    const isValid = data.token === "EXPECTED_TOKEN";
    return { token: data.token, isValid };
  }),
});
