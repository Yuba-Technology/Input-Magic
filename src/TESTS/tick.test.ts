import { Ticker, TaskList } from "@/tick";

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
    let ticker: Ticker;

    beforeEach(() => {
        jest.useFakeTimers();
        ticker = new Ticker();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // *Note: Testing private methods like _execute and _runTasks directly is not recommended.
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
            jest.advanceTimersByTime(Ticker.TickDuration);
        }

        const callTimes = mockTask.update.mock.invocationCallOrder;
        expect(callTimes.length).toBeCloseTo(totalTicks + 1, -2); // allow 2 digits of tolerance
    });
});
