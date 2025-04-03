import { z } from "zod";
import { WebSocket } from "ws";
import { TRPCError } from "@trpc/server";
import { env } from "rbgs/env.mjs";

import {
    createTRPCRouter,
    protectedProcedure,
} from "rbgs/server/api/trpc";

/* 
 * This remains to be implemented
 * in our websocket
 */
interface WebSocketResponse {
    success : boolean;
    data? : string;	// success=true
    error? : string;	// success=false
}

interface WebSocketRequest {
    x : number;
    y : number;
    trackId : number;
}

export const lockerRouter = createTRPCRouter({

    selectOpen: protectedProcedure 
    .input(
	z.object({
	    x: z.number(),
	    y: z.number(),
	})
    )
    .query( async ({ input }) => {
	let response = "";
	try {
	    const ws = new WebSocket(env.WEBSOCKET_URL);

	    // Wait for connection to open
	    await new Promise<void>((resolve, reject) => {
		ws.once('open', () => { resolve(); });
		ws.once('error', () => { reject(); });
	    });

	    // TODO: Define response JSON object and parse it here
	    // Note: Welcome message (if any) is not being skipped
	    // Send and wait for response, then parse into object
	    response = await new Promise<string>((resolve, reject) => {
		ws.on('message', (data: string) => { resolve( data ); });
		ws.on('error', () => { reject(); });
		const body : WebSocketRequest = { x: input.x, y: input.y, trackId: 0 };
		ws.send(JSON.stringify(body));
	    });

	    ws.close();
	} catch (error) { // Only throw HTTP errors when there is a connection issue
	    console.error(error);
	    throw new TRPCError({
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Could not connect to the upstream server.',
	    });
	}

	return response;
    }),
});
