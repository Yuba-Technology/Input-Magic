import { keyboardState } from "@/control/state";

/**
 * The `KeyboardManager` class is responsible for managing keyboard events within the game context.
 * It listens for keydown and keyup events, and updates the state of the keys accordingly.
 * When a key state changes, it calls the `keyboardState` to update the state of the keys.
 * This class is specifically designed for handling in-game keyboard events and is not suitable for managing input fields.
 *
 * @see {@link keyboardState} for the state storager and key event publisher.
 */
class KeyboardManager {
    /**
     * The singleton instance of the keyboard manager.
     * @private
     * @static
     */
    private static instance: KeyboardManager;

    constructor() {
        // Bind this to the event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
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
     * Handle the keydown event.
     * @param event The keydown event.
     * @private
     */
    private handleKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        keyboardState.press(event.key);
    }

    /**
     * Handle the keyup event.
     * @param event The keyup event.
     * @private
     */
    private handleKeyUp(event: KeyboardEvent) {
        event.preventDefault();
        keyboardState.release(event.key);
    }

    /**
     * Start the keyboard manager.
     * It listens to the keydown and keyup events.
     */
    start() {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    /**
     * Stop the keyboard manager.
     * It removes the listeners of the keydown and keyup events.
     */
    stop() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }
}

// Auto initialize the keyboard manager when the script is loaded.
const keyboardManager = KeyboardManager.getInstance();

export { keyboardManager };
