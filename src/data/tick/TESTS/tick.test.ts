import { TickerConfig } from "@/data/tick/config";
import { ticker, TaskList } from "@/data/tick/tick";
import { eventBus } from "@/data/event-bus";

describe("TaskManager", () => {
    let taskList: TaskList;

    beforeEach(() => {
        taskList = new TaskList();
    });

    it("should return its value as an array", () => {
        expect(taskList.valueOf()).toEqual([]);
    });

    it("should auto sort tasks by priority", () => {
        const task1 = { priority: 1, update: jest.fn() };
        const task2 = { priority: 2, update: jest.fn() };
        const task3 = { priority: 3, update: jest.fn() };

        taskList.add(task2);
        taskList.add(task1);
        taskList.add(task3);

        expect(taskList.valueOf()).toEqual([task3, task2, task1]);
    });

    it("should sweep disposed tasks", () => {
        const task1 = { priority: 1, update: jest.fn() };
        const task2 = { priority: 2, update: jest.fn(), disposed: true };
        const task3 = { priority: 3, update: jest.fn() };
        const task4 = { priority: 4, update: jest.fn(), disposed: true };

        taskList.add(task1);
        taskList.add(task2);
        taskList.add(task3);
        taskList.add(task4);

        taskList.sweep();

        const expectedTasks = new TaskList();
        expectedTasks.add(task1);
        expectedTasks.add(task3);

        expect(taskList).toEqual(expectedTasks);
    });
});

describe("Ticker", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        ticker.stop();
        ticker.tasks.clear();
        jest.useRealTimers();
    });

    // *Note: Testing private methods like execute and runTasks directly is not recommended.
    // *Instead, you should test the public methods that use them, and check their effects.
    it("should initialize correctly", () => {
        expect(ticker).toBeDefined();
        expect(ticker.getMillisecondsUntilNextTick()).toBeNull();
    });

    it("should start and stop correctly", () => {
        ticker.start();
        expect(ticker.getMillisecondsUntilNextTick()).not.toBeNull();

        ticker.stop();
        expect(ticker.getMillisecondsUntilNextTick()).toBeNull();
    });

    it("should call tasks approximately every TickDuration for 10 times", () => {
        const mockTask = {
            update: jest.fn(),
            priority: 1
        };

        ticker.tasks.add(mockTask);
        ticker.start();

        const totalTicks = 10000;
        for (let i = 1; i <= totalTicks; i++) {
            jest.advanceTimersByTime(TickerConfig.TickDuration);
        }

        const callTimes = mockTask.update.mock.invocationCallOrder;
        expect(callTimes.length).toBeCloseTo(totalTicks + 1, -2); // allow 2 digits of tolerance
    });

    it("should emit a ticker:tick event on each tick", () => {
        // Prepare a task that updates the blocks
        const testBlocks = new Set([
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 }
        ]);
        const mockHandler = jest.fn();
        const blockChanger = {
            priority: 1,
            update: () => testBlocks
        };

        // Add the task to the ticker
        ticker.tasks.add(blockChanger);

        // Subscribe to the tick event
        eventBus.on("ticker:tick", mockHandler);

        // Start the ticker
        ticker.start();

        expect(mockHandler).toHaveBeenCalled();
        expect(mockHandler.mock.calls[0][0]).toEqual({
            changedBlocks: testBlocks
        });
    });

    it("should add a task when receiving a 'ticker:register' event", () => {
        const mockTask = {
            priority: 1,
            update: jest.fn()
        };

        eventBus.emit("ticker:register", { task: mockTask });
        expect(ticker.tasks).toContain(mockTask);
    });
});
