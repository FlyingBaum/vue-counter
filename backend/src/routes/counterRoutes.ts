import { IncomingMessage, ServerResponse } from "http";
import { getCounter, increaseCounter } from "../controllers/counterController";

const counterRoutes = (req: IncomingMessage, res: ServerResponse): boolean => {
	if (req.method === "GET" && req.url === "/counter") {
		getCounter(req, res);
		return true;
	} else if (req.method === "POST" && req.url === "/increment") {
		increaseCounter(req, res);
		return true;
	}
	return false;
};

export default counterRoutes;
