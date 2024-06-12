import { eventBus } from "@/event-bus";

type KeyEvent = {
    pressedKeys: Set<string>; // The set of pressed keys.
};

class KeyboardState {
    useLowerCase: boolean = true; // Whether to use lower case for the single character keys.
    private static instance: KeyboardState; // The singleton instance of the keyboard manager.
    private pressedKeys: Set<string> = new Set(); // The set of pressed keys.

    constructor() {
        // Bind this to the event handlers
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        document.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
    }

    /**
     * Get the singleton instance of the keyboard manager.
     * @returns The singleton instance of the keyboard manager.
     */
    static getInstance(): KeyboardState {
        KeyboardState.instance ||= new KeyboardState();
        return KeyboardState.instance;
    }

    /**
     * Check whether the key is pressed.
     * @param key The key to be checked.
     * @returns Whether the key is pressed.
     */
    private isKeyPressed(key: string): boolean {
        if (key.length > 1 || key === " ") return this.pressedKeys.has(key);

        const keyUpper = key.toUpperCase();
        const keyLower = key.toLowerCase();

        return (
            this.pressedKeys.has(keyUpper) || this.pressedKeys.has(keyLower)
        );
    }

    /**
     * Delete the key from the pressed keys.
     * @param key The key to be deleted.
     */
    private deleteKey(key: string) {
        if (key.length > 1 || key === " ") {
            this.pressedKeys.delete(key);
            return;
        }

        const keyUpper = key.toUpperCase();
        const keyLower = key.toLowerCase();

        this.pressedKeys.delete(keyUpper);
        this.pressedKeys.delete(keyLower);
    }

    /**
     * Presses a key and adds it to the set of pressed keys.
     *
     * @param keyString The key to press.
     */
    press(keyString: string) {
        if (this.isKeyPressed(keyString)) return;

        const key =
            this.useLowerCase && keyString.length === 1 && keyString !== " "
                ? keyString.toLowerCase()
                : keyString;
        this.pressedKeys.add(key);
        this.publishKeyEvent();
    }

    /**
     * Releases a key and removes it from the set of pressed keys.
     *
     * @param keyString The key to release.
     */
    release(keyString: string) {
        if (!this.isKeyPressed(keyString)) return;

        const key =
            this.useLowerCase && keyString.length === 1 && keyString !== " "
                ? keyString.toLowerCase()
                : keyString;
        this.deleteKey(key);
        this.publishKeyEvent();
    }

    /**
     * Clear the pressed keys.
     */
    clearPressedKeys() {
        if (this.pressedKeys.size === 0) return;

        this.pressedKeys.clear();
        this.publishKeyEvent();
    }

    /**
     * Handle the visibility change event.
     * @private
     */
    private handleVisibilityChange() {
        if (document.visibilityState !== "hidden") return;

        this.clearPressedKeys();
    }

    /**
     * Publish the "keychange" event.
     * @private
     */
    private publishKeyEvent() {
        const keyEvent: KeyEvent = {
            pressedKeys: new Set(this.pressedKeys)
        };
        eventBus.emit("keychange", keyEvent);
    }
}

// Auto initialize the keyboard state when the script is loaded.
const keyboardState = KeyboardState.getInstance();

export { keyboardState, KeyEvent };
