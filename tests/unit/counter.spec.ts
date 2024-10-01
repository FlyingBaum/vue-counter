import { mount } from "@vue/test-utils";
import Counter from "@/components/Counter.vue";

describe("Counter.vue", () => {
	beforeEach(() => {
		globalThis.fetch = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders the correct initial count", () => {
		const wrapper = mount(Counter);
		expect(wrapper.text()).toContain("0");
	});

	it("increments the counter when the button is clicked", async () => {
		const mockResponse = { count: 1 };
		(globalThis.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		});

		const wrapper = mount(Counter);

		await wrapper.find("button").trigger("click");

		// Await the next tick to allow the promise to resolve.
		await new Promise((resolve) => setTimeout(resolve, 0));
		await wrapper.vm.$nextTick();

		// Check if the button text has updated to "1".
		expect(wrapper.text()).toContain("1");
		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
		expect(globalThis.fetch).toHaveBeenCalledWith(
			"http://localhost:3000/increment",
			{
				method: "POST",
			}
		);
	});

	it("handles fetch failure", async () => {
		(globalThis.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
		});

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		const wrapper = mount(Counter);

		await wrapper.find("button").trigger("click");
		await new Promise((resolve) => setTimeout(resolve, 0));
		await wrapper.vm.$nextTick();

		expect(consoleSpy).toHaveBeenCalledWith("Failed to increment counter.");
		consoleSpy.mockRestore();
		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
	});

	it("handles network error", async () => {
		(globalThis.fetch as jest.Mock).mockRejectedValueOnce(
			new Error("Network error")
		);

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		const wrapper = mount(Counter);

		await wrapper.find("button").trigger("click");
		await new Promise((resolve) => setTimeout(resolve, 0));
		await wrapper.vm.$nextTick();

		expect(consoleSpy).toHaveBeenCalledWith(
			"Error incrementing counter:",
			expect.any(Error)
		);
		consoleSpy.mockRestore();
		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
	});
});
