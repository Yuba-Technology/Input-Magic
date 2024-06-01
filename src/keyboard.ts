import { eventBus } from "@/event-bus";

type KeyEvent = {
    pressedKeys: Set<string>; // The set of pressed keys.
};

/**
 * A manager that manages the keyboard events.
 * It emits a "keychange" event when the pressed keys change.
 * The event data is a `KeyEvent` object.
 * @see KeyEvent
 * @see eventBus
 */
class KeyboardManager {
    private static instance: KeyboardManager; // The singleton instance of the keyboard manager.
    private pressedKeys: Set<string> = new Set(); // The set of pressed keys.

    /**
     * @constructor
     */
    private constructor() {
        this.init();
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
     * Initialize the keyboard manager.
     */
    private init() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
        document.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange.bind(this)
        );
    }

    private isKeyPressed(key: string): boolean {
        if (key.length > 1 || key === " ") return this.pressedKeys.has(key);

        const keyUpper = key.toUpperCase();
        const keyLower = key.toLowerCase();

        return (
            this.pressedKeys.has(keyUpper) || this.pressedKeys.has(keyLower)
        );
    }

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
     * Handle the keydown event.
     * @param event The keydown event.
     * @private
     */
    private handleKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        if (this.isKeyPressed(event.key)) return;

        this.pressedKeys.add(event.key);
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
}

// Auto initialize the keyboard manager when the script is loaded.
KeyboardManager.getInstance();
