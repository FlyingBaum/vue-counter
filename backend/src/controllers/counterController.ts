import { IncomingMessage, ServerResponse } from "http";
import { broadcastCount } from "../index";
import { getCount, incrementCount } from "../states";

export const getCounter = (req: IncomingMessage, res: ServerResponse): void => {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ count: getCount() }));
};

export const increaseCounter = (
	req: IncomingMessage,
	res: ServerResponse
): void => {
	let body = "";
	req.on("data", (chunk) => {
		body += chunk.toString();
	});
	req.on("end", () => {
		const updatedCount = incrementCount();
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ count: updatedCount }));
		// Notify all WebSocket clients about the update.
		broadcastCount();
	});
};
