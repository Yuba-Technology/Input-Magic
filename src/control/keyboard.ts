import { eventBus } from "@/data/event-bus";

/**
 * Structure of the event data emitted by the KeyboardManager.
 */
type KeyEvent = {
    /**
     * The set of pressed keys.
     */
    pressedKeys: Set<string>;
};

/**
 * Manages keyboard events for in-game interactions.
 * Emits a "keychange" event on key press or release, encapsulated in a `KeyEvent` object.
 * Not intended for handling input fields.
 *
 * @see {@link KeyEvent} - Structure of the event data.
 * @see {@link eventBus} - Event handling system used.
 */
class KeyboardManager {
    /**
     * Singleton instance of the KeyboardManager class.
     * @static
     */
    private static instance: KeyboardManager;
    /**
     * Determines if single character keys should be converted to lower case.
     *
     * Default to `true`.
     */
    useLowerCase: boolean = true;
    /**
     * Set of currently pressed keys.
     * @private
     */
    private pressedKeys: Set<string> = new Set();

    constructor() {
        // Bind this to the event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    /**
     * Retrieves the singleton instance of the KeyboardManager class,
     * creating it if it doesn't exist.
     * @returns The singleton instance of the KeyboardManager class.
     * @static
     */
    static getInstance(): KeyboardManager {
        KeyboardManager.instance ||= new KeyboardManager();
        return KeyboardManager.instance;
    }

    /**
     * Determines whether the specified key is currently pressed.
     *
     * For single character keys (a-z, A-Z), both upper case
     * and lower case versions are checked.
     * @param key The key to check.
     * @returns `true` if the key is pressed, `false` otherwise.
     * @private
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
     * Removes the specified key from the set of pressed keys.
     *
     * If the key is a single character, both its upper case
     * and lower case versions are removed.
     * @param key The key to be removed.
     * @private
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
     * Handles the keydown event by adding the key to the pressed keys list
     * and publishing a `keychange` event.
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
     * Handles the keyup event by removing the key from the pressed keys list
     * and publishing a `keychange` event.
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
     * Handles the visibility change event.
     *
     * If the document becomes hidden, it clears the list of pressed keys.
     * @private
     */
    private handleVisibilityChange() {
        if (document.visibilityState !== "hidden") return;

        this.clearPressedKeys();
    }

    /**
     * Clears the list of pressed keys and triggers a `keychange` event.
     * @private
     */
    private clearPressedKeys() {
        this.pressedKeys.clear();
        this.publishKeyEvent();
    }

    /**
     * Triggers a `keychange` event with the current set of pressed keys.
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
     *
     * It listens to the `keydown`, `keyup`, and `visibilitychange` events.
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
     *
     * It removes the listeners of the `keydown`, `keyup`, and `visibilitychange` events.
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
