import { BlockPos } from "@/map/block";
import { eventBus } from "@/event-bus";

interface TickerTask {
    /**
     * The priority of the task. The higher the number, the higher the priority.
     */
    readonly priority: number;
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
     * Whether the task is disposed. If true, the task will be removed from the ticker.
     *
     * This will be checked after done calling the update function, so the task can be
     * disposed in the update function.
     *
     * Default to false.
     */
    disposed?: boolean | (() => boolean);
    /**
     * The dispose function of the task to be called when the task is removed from the ticker.
     */
    dispose?: () => void;
}

/**
 * A list of tasks to be executed on each tick.
 * The tasks will be sorted by their priority.
 */
class TaskList {
    private tasks: TickerTask[] = [];

    valueOf() {
        return this.tasks;
    }

    [Symbol.iterator]() {
        return this.tasks[Symbol.iterator]();
    }

    /**
     * Add a new task to the list.
     * @param task The task to be added.
     */
    add(task: TickerTask) {
        let i = this.tasks.length;
        while (i > 0 && this.tasks[i - 1].priority < task.priority) {
            this.tasks[i] = this.tasks[i - 1];
            i--;
        }

        this.tasks[i] = task;
    }

    /**
     * Check whether the task is disposed.
     * @param task The task to be checked.
     * @returns Whether the task is disposed.
     */
    private isDisposed(task: TickerTask): boolean {
        switch (typeof task.disposed) {
            case "function": {
                return (task.disposed as () => boolean)();
            }

            case "boolean": {
                return task.disposed as boolean;
            }

            default: {
                return false;
            }
        }
    }

    /**
     * Dispose the tasks that are disposed.
     * This will call the dispose function of the task.
     */
    sweep() {
        this.tasks = this.tasks.filter((task) => {
            if (!this.isDisposed(task)) return true;
            if (typeof task.dispose === "function") task.dispose();
            return false;
        });
    }
}

interface TickerInterface {
    // The tasks to be executed on each tick.
    tasks: TaskList;
    // Get the number of milliseconds until the next tick. If null, the ticker is not started.
    getMillisecondsUntilNextTick(): number | null;
    // Start the ticker.
    start(): void;
    // Stop the ticker.
    stop(): void;
}

/**
 * A ticker that executes tasks on each tick.
 * The tasks will be executed in the order of their priority.
 * After each tick, the ticker will emit a tick event with the changed blocks.
 */
class Ticker implements TickerInterface {
    static TPS = 10; // Ticks per second
    static TickDuration = 1000 / Ticker.TPS; // The duration of each tick, milliseconds
    tasks: TaskList; // The tasks to be executed on each tick.
    // The time when the instance of the ticker is started, milliseconds, from performance.now(). If null, the ticker is not started.
    private startTime: number | null = null;
    // The ID of the ticker. If null, the ticker is not running.
    private timeoutId: NodeJS.Timeout | number | null = null;

    /**
     * @constructor
     */
    constructor() {
        this.tasks = new TaskList();
        this.execute = this.execute.bind(this);
    }

    /**
     * Start the ticker.
     */
    start() {
        if (this.startTime !== null) return;

        this.startTime = performance.now();
        this.execute();
    }

    /**
     * Stop the ticker.
     */
    stop() {
        if (this.startTime === null) return;

        this.startTime = null;
        clearTimeout(this.timeoutId!);
        this.timeoutId = null;
    }

    /**
     * Execute the tasks in each tick, and call the next tick's execute function.
     */
    private execute() {
        this.runTasks();
        this.timeoutId = setTimeout(
            this.execute,
            this.getMillisecondsUntilNextTick()!
        );
    }

    /**
     * Run the tasks in each tick.
     */
    private runTasks() {
        const changedBlocks = new Set<BlockPos>();

        for (const task of this.tasks) {
            const changedBlocksInTask = task.update(); // Do the task and get the changed blocks.
            if (changedBlocksInTask === undefined) continue;

            // Add the changed blocks to the set of changed blocks.
            for (const blockPos of changedBlocksInTask) {
                changedBlocks.add(blockPos);
            }
        }

        // Remove the disposed tasks.
        this.tasks.sweep();

        // Emit the tick event.
        eventBus.emit("tick", { changedBlocks });
    }

    /**
     * Get the number of milliseconds until the next tick.
     * @returns The number of milliseconds until the next tick.
     */
    getMillisecondsUntilNextTick(): number | null {
        if (this.startTime === null) return null;
        return (
            Ticker.TickDuration -
            ((performance.now() - this.startTime) % Ticker.TickDuration)
        );
    }
}

export { Ticker, TickerTask, TickerInterface, TaskList };
