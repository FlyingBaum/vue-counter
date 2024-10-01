import {
	getCounter,
	increaseCounter,
} from "../src/controllers/counterController";
import { incrementCount, getCount } from "../src/states";

import * as httpMocks from "node-mocks-http";

jest.mock("../src/states", () => ({
	getCount: jest.fn(),
	incrementCount: jest.fn(),
}));

jest.mock("../src/index", () => ({
	broadcastCount: jest.fn(),
}));

describe("Counter Controller", () => {
	it("should return the current count", () => {
		const req = httpMocks.createRequest();
		const res = httpMocks.createResponse();
		(getCount as jest.Mock).mockReturnValue(10);
		getCounter(req, res);

		expect(res._getStatusCode()).toBe(200);
		expect(JSON.parse(res._getData())).toEqual({ count: 10 });
	});

	it("should increment the count", () => {
		const req = httpMocks.createRequest({
			method: "POST",
			url: "/increment",
		});
		const res = httpMocks.createResponse();

		(incrementCount as jest.Mock).mockReturnValue(11);

		increaseCounter(req, res);

		req.emit("data", "");
		req.emit("end");

		expect(res._getStatusCode()).toBe(200);
		expect(JSON.parse(res._getData())).toEqual({ count: 11 });
	});
});
