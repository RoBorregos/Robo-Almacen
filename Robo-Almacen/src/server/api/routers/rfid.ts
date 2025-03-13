import { publicProcedure, createTRPCRouter } from "../trpc";

export const rfidRouter = createTRPCRouter({
  readToken: publicProcedure
    .mutation(async () => {
      // Send a request to the Raspberry Pi (via HTTP or WebSocket)
      const response = await fetch("http://raspberrypi.local:5000/read-rfid");
      const data = await response.json();

      // Verify token
      const isValid = data.token === "EXPECTED_TOKEN";
      return { token: data.token, isValid };
    }),
});
