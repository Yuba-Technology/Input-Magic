export const TickerConfig = {
    /**
     * Ticks per second.
     */
    TPS: 10,
    /**
     * The duration of each tick, milliseconds.
     */
    get TickDuration() {
        return 1000 / this.TPS;
    }
};
