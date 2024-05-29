type EventHandler = (event: object) => void | Promise<void>;

/**
 * An event bus that allows subscribing to and emitting events.
 */
class EventBus {
    private static _instance: EventBus;
    private _events: { [key: string]: EventHandler[] } = {};

    /**
     * Get the singleton instance of the event bus.
     * @returns The singleton instance of the event bus.
     */
    static getInstance(): EventBus {
        EventBus._instance ||= new EventBus();
        return EventBus._instance;
    }

    /**
     * Subscribe to an event.
     * @param event The event name.
     * @param handler The event handler.
     */
    on(event: string, handler: EventHandler): void {
        this._events[event] ||= [];
        this._events[event].push(handler);
    }

    /**
     * Unsubscribe from an event.
     * @param event The event name.
     * @param handler The event handler.
     */
    off(event: string, handler?: EventHandler): void {
        if (!this._events[event]) return;

        if (handler) {
            this._events[event] = this._events[event].filter(
                (h) => h !== handler
            );
        } else {
            delete this._events[event];
        }
    }

    /**
     * Emit an event.
     * @param name The event name.
     * @param event The event data.
     */
    async emit(name: string, event: object): Promise<void> {
        if (!this._events[name]) return;

        await Promise.all(this._events[name].map((handler) => handler(event)));
    }
}

const eventBus = EventBus.getInstance();

export { eventBus, EventHandler };
