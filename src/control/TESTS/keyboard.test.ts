import { keyboardManager } from "@/control/keyboard";
import { keyboardState } from "@/control/state";

describe("KeyboardManager", () => {
    let keydownEvent: KeyboardEvent;
    let keyupEvent: KeyboardEvent;
    let pressSpy: jest.SpyInstance;
    let releaseSpy: jest.SpyInstance;

    beforeEach(() => {
        keyboardManager.stop();
        keydownEvent = new KeyboardEvent("keydown", { key: "a" });
        keyupEvent = new KeyboardEvent("keyup", { key: "a" });
        pressSpy = jest.spyOn(keyboardState, "press");
        releaseSpy = jest.spyOn(keyboardState, "release");
    });

    afterEach(() => {
        pressSpy.mockRestore();
        releaseSpy.mockRestore();
    });

    it("should start the keyboard manager properly", () => {
        const addEventListenerSpy = jest.spyOn(document, "addEventListener");
        keyboardManager.start();
        expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it("should stop the keyboard manager properly", () => {
        const removeEventListenerSpy = jest.spyOn(
            document,
            "removeEventListener"
        );
        keyboardManager.start();
        keyboardManager.stop();
        expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it("should call keyboardState.press on keydown event", () => {
        keyboardManager.start();
        document.dispatchEvent(keydownEvent);
        keyboardManager.stop();
        expect(pressSpy).toHaveBeenCalledWith("a");
    });

    it("should call keyboardState.release on keyup event", () => {
        keyboardManager.start();
        document.dispatchEvent(keyupEvent);
        keyboardManager.stop();
        expect(releaseSpy).toHaveBeenCalledWith("a");
    });
});
