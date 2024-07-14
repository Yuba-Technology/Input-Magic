import { elementInSet } from "../utils";
import { eventBus, EventData } from "@/event-bus";
import { BlockPos } from "@/map/block";
import { TickerTask, TickerTaskEventData } from "@/tick/types";
import { TickerConfig } from "@/tick/config";

/**
 * A list of tasks to be executed on each tick.
 * The tasks will be sorted by their priority automatically when added.
 */
class TaskList {
    /**
     * The tasks to be executed on each tick.
     * @private
     */
    private tasks: TickerTask[] = [];

    valueOf() {
        return this.tasks;
    }

    [Symbol.iterator]() {
        return this.tasks[Symbol.iterator]();
    }

    /**
     * Adds a new task to the list, placing it according to its priority.
     * Higher priority tasks are placed closer to the end of the list.
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
     * Determines whether the given task is disposed.
     *
     * If the task does not have a `·`disposed` property,
     * it is considered not disposed and `false` is returned.
     * @param task The task to check.
     * @returns `true` if the task is disposed, `false` otherwise.
     * @private
     */
    private isDisposed(task: TickerTask): boolean {
        const { disposed } = task;
        return typeof disposed === "function" ? disposed() : Boolean(disposed);
    }

    /**
     * Removes disposed tasks from the task list.
     * If a task has a dispose function, it will be called during removal.
     */
    sweep() {
        this.tasks = this.tasks.filter((task) => {
            if (!this.isDisposed(task)) return true;
            if (typeof task.dispose === "function") task.dispose();
            return false;
        });
    }

    /**
     * Clears all tasks from the list.
     */
    clear() {
        this.tasks = [];
    }
}

/**
 * A ticker that executes tasks at a fixed interval, defined by TPS (Ticks Per Second).
 *
 * Tasks are executed based on their priority.
 *
 * After each tick, a 'tick' event is emitted with the blocks that
 * have changed during that tick.
 *
 * @see {@link TickerTask} - Structure of the event data.
 */
class Ticker {
    /**
     * The tasks to be executed on each tick.
     */
    tasks: TaskList;
    /**
     * The singleton instance of the ticker.
     */
    private static instance: Ticker;
    /**
     * The start time of the ticker instance in milliseconds.
     *
     * Derived from `performance.now()`, where the time origin is when the page loads,
     * not the Unix epoch like `Date.now()`.
     *
     * If `null`, the ticker has not started.
     */
    private startTime: number | null = null;
    /**
     * The ID of the timer that schedules the next tick.
     *
     * The type is `NodeJS.Timeout` in Node.js and `number` in browsers.
     *
     * If `null`, the ticker is not running.
     */
    private timerId: NodeJS.Timeout | number | null = null;

    /**
     * @constructor
     */
    constructor() {
        this.tasks = new TaskList();
        this.execute = this.execute.bind(this);
    }

    static getInstance(): Ticker {
        Ticker.instance ||= new Ticker();
        return Ticker.instance;
    }

    /**
     * Starts the ticker, if it's not already running.
     */
    start() {
        if (this.startTime !== null) return;

        this.startTime = performance.now();
        this.execute();
    }

    /**
     * Starts the ticker, if it's not already running.
     */
    stop() {
        if (this.startTime === null) return;

        this.startTime = null;
        clearTimeout(this.timerId!); // Remove the scheduled next tick.
        this.timerId = null;
    }

    /**
     * Executes the tasks for the current tick and schedules the next tick.
     * @private
     */
    private execute() {
        this.runTasks();
        this.timerId = setTimeout(
            this.execute,
            this.getMillisecondsUntilNextTick()!
        );
    }

    /**
     * Executes all tasks for the current tick, collects changed blocks,
     * removes disposed tasks, and emits a 'tick' event.
     * @private
     */
    private runTasks() {
        const changedBlocks = new Set<BlockPos>();

        for (const task of this.tasks) {
            const changedBlocksInTask = task.update(); // Do the task and get the changed blocks.
            if (changedBlocksInTask === undefined) continue;

            // Add the changed blocks to the set of changed blocks.
            for (const blockPos of changedBlocksInTask) {
                if (elementInSet(blockPos, changedBlocks)) continue;
                changedBlocks.add(blockPos);
            }
        }

        // Remove the disposed tasks.
        this.tasks.sweep();

        // Emit the tick event.
        eventBus.emit("ticker:tick", { changedBlocks });
    }

    /**
     * Calculates the time remaining until the next tick.
     * @returns The time in milliseconds until the next tick, or `null` if the ticker has not started.
     */
    getMillisecondsUntilNextTick(): number | null {
        if (this.startTime === null) return null;
        return (
            TickerConfig.TickDuration -
            ((performance.now() - this.startTime) % TickerConfig.TickDuration)
        );
    }
}

const ticker = Ticker.getInstance();

eventBus.on("ticker:register", (data: EventData) => {
    const { task } = data as TickerTaskEventData;
    ticker.tasks.add(task);
});

export { ticker, TaskList };
