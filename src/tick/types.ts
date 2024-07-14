import { BlockPos } from "@/map/block";

type TickEventData = {
    /**
     * The set of blocks that have changed during the tick.
     */
    changedBlocks: Set<BlockPos>;
};

/**
 * A task to be executed on each tick.
 */
interface TickerTask {
    /**
     * The priority of the task. The higher the number, the higher the priority.
     */
    readonly priority: number;
    /**
     * Whether the task is disposed. If `true`, the task will be removed from the ticker.
     *
     * This will be checked after done calling the update function, so the task can be
     * disposed in the update function.
     *
     * Default to `false`.
     */
    disposed?: boolean | (() => boolean);
    /**
     * The update function of the task to be called on each tick.
     *
     * The function should return the positions of the blocks that has been changed and
     * may affect the rendering of the map.
     *
     * If not empty, the renderer will calculate
     * whether the screen (or exactly the canvas) needs to be updated.
     * @returns The positions of the blocks that has been changed and may affect the rendering of the map.
     */
    update: () => Set<BlockPos> | void;
    /**
     * The dispose function of the task to be called when the task is removed from the ticker.
     */
    dispose?: () => void;
}

type TickerTaskEventData = {
    task: TickerTask;
};

export { TickEventData, TickerTask, TickerTaskEventData };
