/**
 * The structure of an event data object.
 *
 * Notice that we use the `unknown` type for the values of the object,
 * which allows for flexibility in the structure of the event data.
 * This structure is used to define the data that is passed to the event handlers.
 */
type EventData = {
    [key: string]: unknown;
};

/**
 * Event handler function type.
 */
type EventHandler = (event: EventData) => void | Promise<void>;

/**
 * An event bus that implements the publish-subscribe pattern.
 * It allows components of an application to communicate with each other
 * by subscribing to and emitting named events. The EventBus class is a singleton,
 * ensuring that only one instance of the event bus exists in the application.
 *
 * @see {@link EventData} for the structure of the event data.
 * @see {@link EventHandler} for the structure of the event handler.
 */

class EventBus {
    /**
     * The singleton instance of the event bus.
     */
    private static instance: EventBus;
    /**
     * The events and their corresponding handlers.
     */
    private events: { [key: string]: EventHandler[] } = {};

    /**
     * Get the singleton instance of the event bus.
     * @returns The singleton instance of the event bus.
     */
    static getInstance(): EventBus {
        EventBus.instance ||= new EventBus();
        return EventBus.instance;
    }

    /**
     * Subscribe to an event.
     * @param event The event name.
     * @param handler The event handler.
     */
    on(event: string, handler: EventHandler): void {
        this.events[event] ||= [];
        this.events[event].push(handler);
    }

    /**
     * Unsubscribe from an event.
     * @param event The event name.
     * @param handler The event handler.
     */
    off(event: string, handler?: EventHandler): void {
        if (!this.events[event]) return;

        if (handler) {
            this.events[event] = this.events[event].filter(
                (h) => h !== handler
            );
        } else {
            delete this.events[event];
        }
    }

    /**
     * Emit an event.
     * @param name The event name.
     * @param event The event data.
     */
    async emit(name: string, event: EventData): Promise<void> {
        if (!this.events[name]) return;

        await Promise.all(this.events[name].map((handler) => handler(event)));
    }
}

const eventBus = EventBus.getInstance();

export { eventBus, EventHandler };
