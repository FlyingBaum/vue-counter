import { getCount, incrementCount } from "../src/states";

describe("State Management", () => {
	it("should initialize to 0", () => {
		expect(getCount()).toBe(0);
	});

	it("should increment the count", () => {
		incrementCount();
		expect(getCount()).toBe(1);
	});
});
