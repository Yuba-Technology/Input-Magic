import { eventBus } from "@/event-bus";

describe("EventBus", () => {
    it("should correctly subscribe and emit events", async () => {
        const mockHandler = jest.fn();
        eventBus.on("testEvent", mockHandler);

        await eventBus.emit("testEvent", { data: "test" });

        expect(mockHandler).toHaveBeenCalledWith({ data: "test" });
    });

    it("should correctly unsubscribe from events", async () => {
        const mockHandler = jest.fn();
        eventBus.on("testEvent2", mockHandler);
        eventBus.off("testEvent2", mockHandler);

        await eventBus.emit("testEvent2", { data: "test" });

        expect(mockHandler).not.toHaveBeenCalled();
    });

    it("should not fail when emitting an event with no subscribers", async () => {
        await expect(
            eventBus.emit("nonExistentEvent", {})
        ).resolves.not.toThrow();
    });
});
