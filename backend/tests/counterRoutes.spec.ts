import counterRoutes from "../src/routes/counterRoutes";
import * as counterController from "../src/controllers/counterController";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("../src/controllers/counterController", () => ({
	getCounter: jest.fn((req, res) => res.end("Mock getCounter")),
	increaseCounter: jest.fn((req, res) => res.end("Mock increaseCounter")),
}));

describe("Counter Routes", () => {
	it("should route to getCounter for /counter GET", () => {
		const req = createRequest({
			method: "GET",
			url: "/counter",
		});
		const res = createResponse();

		expect(counterRoutes(req, res)).toBe(true);
		expect(counterController.getCounter).toHaveBeenCalledWith(req, res);
	});

	it("should route to increaseCounter for /increment POST", () => {
		const req = createRequest({
			method: "POST",
			url: "/increment",
		});
		const res = createResponse();

		expect(counterRoutes(req, res)).toBe(true);
		expect(counterController.increaseCounter).toHaveBeenCalledWith(
			req,
			res
		);
	});

	it("should return false for unknown routes", () => {
		const req = createRequest({
			method: "GET",
			url: "/unknown",
		});
		const res = createResponse();

		expect(counterRoutes(req, res)).toBe(false);
	});
});
