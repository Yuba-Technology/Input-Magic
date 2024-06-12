import { keyboardState, KeyEvent } from "@/control/state";
import { eventBus } from "@/event-bus";

describe("KeyboardState", () => {
    let emitSpy: jest.SpyInstance;

    beforeEach(() => {
        keyboardState.clearPressedKeys();
        emitSpy = jest.spyOn(eventBus, "emit");
    });

    afterEach(() => {
        emitSpy.mockRestore();
    });

    it("should add key to pressedKeys set on press", () => {
        keyboardState.press("a");
        // Do again to test if it will ignore because it's already pressed.
        keyboardState.press("a");
        keyboardState.press("b");

        const expectedCalls: string[][] = [["a"], ["a", "b"]];
        for (const [i, expectedCall] of expectedCalls.entries()) {
            const call: KeyEvent = emitSpy.mock.calls[i][1];
            expect(call.pressedKeys).toEqual(new Set(expectedCall));
        }
    });

    it("should remove key from pressedKeys set on release", () => {
        keyboardState.press("a");
        keyboardState.release("a");
        // Do again to test if it will ignore because it's already released.
        keyboardState.release("a");

        const expectedCalls: string[][] = [["a"], []];
        for (const [i, expectedCall] of expectedCalls.entries()) {
            const call: KeyEvent = emitSpy.mock.calls[i][1];
            expect(call.pressedKeys).toEqual(new Set(expectedCall));
        }
    });

    it("should clear pressedKeys set on clearPressedKeys", () => {
        keyboardState.press("a");
        keyboardState.clearPressedKeys();
        // Do again to test if it will ignore because it's already cleared.
        keyboardState.clearPressedKeys();

        const expectedCalls: string[][] = [["a"], []];
        for (const [i, expectedCall] of expectedCalls.entries()) {
            const call: KeyEvent = emitSpy.mock.calls[i][1];
            expect(call.pressedKeys).toEqual(new Set(expectedCall));
        }
    });

    it("should add lowercase key to pressedKeys set if `useLowerCase` is true", () => {
        keyboardState.useLowerCase = true;
        keyboardState.press("A");

        const expectedCalls: string[][] = [["a"]];
        for (const [i, expectedCall] of expectedCalls.entries()) {
            const call: KeyEvent = emitSpy.mock.calls[i][1];
            expect(call.pressedKeys).toEqual(new Set(expectedCall));
        }
    });

    it("should add original case key to pressedKeys set if `useLowerCase` is false", () => {
        keyboardState.useLowerCase = false;
        keyboardState.press("A");

        const expectedCalls: string[][] = [["A"]];
        for (const [i, expectedCall] of expectedCalls.entries()) {
            const call: KeyEvent = emitSpy.mock.calls[i][1];
            expect(call.pressedKeys).toEqual(new Set(expectedCall));
        }
    });
});
