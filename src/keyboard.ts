import { eventBus } from "@/event-bus";

type KeyEvent = {
    /**
     * The set of pressed keys.
     */
    pressedKeys: Set<string>;
};

/**
 * The `KeyboardManager` is responsible for managing keyboard events.
 * It emits a "keychange" event whenever there is a change in the keys being pressed or released.
 * The event data is encapsulated in a `KeyEvent` object.
 * Please note that this class is primarily intended for handling in-game keyboard events,
 * and is not designed for handling input fields.
 *
 * @see {@link KeyEvent} for the structure of the event data.
 * @see {@link eventBus} for the event handling system used.
 */
class KeyboardManager {
    /**
     * Whether to use lower case for the single character keys.
     * For example, when this is set to `true`, the key `A` will be converted to `a`.
     * Default to `true`.
     */
    useLowerCase: boolean = true;
    /**
     * The singleton instance of the keyboard manager.
     * @static
     */
    private static instance: KeyboardManager; // The singleton instance of the keyboard manager.
    /**
     * The set of pressed keys.
     * @private
     */
    private pressedKeys: Set<string> = new Set(); // The set of pressed keys.

    constructor() {
        // Bind this to the event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    /**
     * Get the singleton instance of the keyboard manager.
     * @returns The singleton instance of the keyboard manager.
     */
    static getInstance(): KeyboardManager {
        KeyboardManager.instance ||= new KeyboardManager();
        return KeyboardManager.instance;
    }

    /**
     * Check whether the key is pressed.
     * @param key The key string from the key event.
     * @returns Whether the key is pressed.
     */
    private isKeyPressed(key: string): boolean {
        if (key.length > 1 || key === " ") return this.pressedKeys.has(key);

        // Both upper case and lower case are checked for
        // single character keys a-z and A-Z.
        // Because when the shift key is pressed, the key event
        // will return the upper case character.
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
            // Not single character key
            this.pressedKeys.delete(key);
            return;
        }

        // Delete both upper case and lower case keys.
        // See the comment in the isKeyPressed method.
        const keyUpper = key.toUpperCase();
        const keyLower = key.toLowerCase();

        this.pressedKeys.delete(keyUpper);
        this.pressedKeys.delete(keyLower);
    }

    /**
     * Handle the keydown event.
     * @param event The keydown event.
     * @private
     */
    private handleKeyDown(event: KeyboardEvent) {
        event.preventDefault();

        // Prevent duplicate publishing of the same keychange event.
        if (this.isKeyPressed(event.key)) return;

        const key =
            this.useLowerCase && event.key.length === 1 && event.key !== " " // Single character key a-z and A-Z
                ? event.key.toLowerCase()
                : event.key;
        this.pressedKeys.add(key);
        this.publishKeyEvent();
    }

    /**
     * Handle the keyup event.
     * @param event The keyup event.
     * @private
     */
    private handleKeyUp(event: KeyboardEvent) {
        event.preventDefault();

        const { key } = event;

        if (!this.isKeyPressed(key)) return;

        this.deleteKey(key);
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
     * Clear the pressed keys.
     * @private
     */
    private clearPressedKeys() {
        this.pressedKeys.clear();
        this.publishKeyEvent();
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

    /**
     * Start the keyboard manager.
     * It listens to the keydown, keyup, and visibilitychange events.
     */
    start() {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
        // Clear the pressed keys when the tab or the broswer is hidden
        document.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
    }

    /**
     * Stop the keyboard manager.
     * It removes the listeners of the keydown, keyup, and visibilitychange events.
     */
    stop() {
        this.clearPressedKeys();
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
        document.removeEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
    }
}

// Auto initialize the keyboard manager when the script is loaded.
const keyboardManager = KeyboardManager.getInstance();

export { keyboardManager, KeyEvent };
