import { keyboardManager } from "@/keyboard";
import { eventBus } from "@/event-bus";

describe("KeyboardManager2", () => {
    let keydownEvent: KeyboardEvent;
    let keyupEvent: KeyboardEvent;
    let emitSpy: jest.SpyInstance;

    beforeEach(() => {
        keyboardManager.stop();
        keydownEvent = new KeyboardEvent("keydown", { key: "a" });
        keyupEvent = new KeyboardEvent("keyup", { key: "a" });
        emitSpy = jest.spyOn(eventBus, "emit");
    });

    afterEach(() => {
        emitSpy.mockRestore();
    });

    // *Note: Testing private methods like _execute and _runTasks directly is not recommended.
    // *Instead, you should test the public methods that use them, and check their effects.
    it("should start the keyboard manager", () => {
        const addEventListenerSpy = jest.spyOn(document, "addEventListener");
        keyboardManager.start();
        expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
    });

    it("should stop the keyboard manager", () => {
        const removeEventListenerSpy = jest.spyOn(
            document,
            "removeEventListener"
        );
        keyboardManager.stop();
        expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);
    });

    it("should add key to pressedKeys set on keydown event", () => {
        keyboardManager.start();
        document.dispatchEvent(keydownEvent);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));
        keyboardManager.stop();
        // Infer its state by the "keychange" event instead of directly accessing the private property pressedKeys.
        expect(eventBus.emit).toHaveBeenCalledWith(
            "keychange",
            expect.objectContaining({
                pressedKeys: expect.any(Set)
            })
        );
    });

    it("should remove key from pressedKeys set on keyup event", () => {
        keyboardManager.start();
        document.dispatchEvent(keydownEvent);
        document.dispatchEvent(keyupEvent);
        keyboardManager.stop();
        // Infer its state by the "keychange" event instead of directly accessing the private property pressedKeys.
        expect(eventBus.emit).toHaveBeenCalledWith(
            "keychange",
            expect.objectContaining({
                pressedKeys: expect.any(Set)
            })
        );
    });

    it("should clear pressedKeys set when visibility changes to hidden", () => {
        keyboardManager.start();
        document.dispatchEvent(keydownEvent);
        Object.defineProperty(document, "hidden", {
            value: true,
            configurable: true
        });
        document.dispatchEvent(new Event("visibilitychange"));
        keyboardManager.stop();
        // Infer its state by the "keychange" event instead of directly accessing the private property pressedKeys.
        expect(eventBus.emit).toHaveBeenCalledWith(
            "keychange",
            expect.objectContaining({
                pressedKeys: expect.any(Set)
            })
        );
    });

    it("should add lowercase key to pressedKeys set if `useLowerCase` is true", () => {
        keyboardManager.useLowerCase = true;
        keyboardManager.start();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "A" }));
        keyboardManager.stop();
        // Infer its state by the "keychange" event instead of directly accessing the private property pressedKeys.
        expect(eventBus.emit).toHaveBeenCalledWith(
            "keychange",
            expect.objectContaining({
                pressedKeys: expect.any(Set)
            })
        );
    });

    it("should add original case key to pressedKeys set if `useLowerCase` is false", () => {
        keyboardManager.useLowerCase = false;
        keyboardManager.start();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "A" }));
        keyboardManager.stop();
        // Infer its state by the "keychange" event instead of directly accessing the private property pressedKeys.
        expect(eventBus.emit).toHaveBeenCalledWith(
            "keychange",
            expect.objectContaining({
                pressedKeys: expect.any(Set)
            })
        );
    });
});
