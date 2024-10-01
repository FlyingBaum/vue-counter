import * as WebSocket from "ws";
import counterRoutes from "./routes/counterRoutes";
import { setHeaders } from "./util/headers";
import { getCount } from "./states";
import { createServer, IncomingMessage, ServerResponse } from "http";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
	setHeaders(res);

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	if (!counterRoutes(req, res)) {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("404 Not Found");
	}
});

const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// WebSocket setup.
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
	console.log("Client connected");

	// Send the current count to the new client.
	ws.send(JSON.stringify({ count: getCount() }));

	ws.on("close", () => {
		console.log("Client disconnected");
	});
});

/**
 * Broadcasts the current count to all WebSocket clients.
 */
export const broadcastCount = () => {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({ count: getCount() }));
		}
	});
};
