/* eslint-disable @typescript-eslint/no-explicit-any */

import { bud } from "@/bud/bud";
import { BudData } from "@/bud/types";
import { getPlaneAdjacent } from "@/bud/utils";
import { BlockPos } from "@/map/block";
import { Dimension } from "@/map/dimension";
import { Generator3D } from "@/map/generator/3d";

// Mock the factory.ts file
let updatedBlockPoses: BlockPos[] = [];

const mockHandleBud = jest.fn((budData: BudData) => {
    updatedBlockPoses.push(budData.pos);
    const adjacentCoordinates = getPlaneAdjacent(budData.pos);
    for (const pos of adjacentCoordinates) {
        bud.add({
            type: 0,
            pos,
            dimension: budData.dimension,
            delay: 0
        });
    }
});

jest.mock("@/bud/factory", () => {
    return {
        __esModule: true, // Tells Jest this is an ES module
        default: {
            getHandlerByType: jest.fn().mockImplementation(() => ({
                handleBud: mockHandleBud
            }))
        }
    };
});

// Mock the eventBus
jest.mock("@/event-bus", () => ({
    eventBus: {
        on: jest.fn()
    }
}));

const dimension = new Dimension({
    id: "test",
    generator: new Generator3D("seed")
});

describe("BUD class", () => {
    beforeEach(() => {
        // Reset the bud
        bud.clear();
        updatedBlockPoses = [];
    });

    const createBudData = (
        x: number,
        y: number,
        z: number,
        type = 0,
        delay = 0
    ): BudData => ({
        type,
        dimension,
        pos: { x, y, z },
        delay
    });

    it("should add BudData to nextQueue", () => {
        const data = createBudData(1, 1, 1);
        bud.add(data);
        expect((bud as any).nextQueue.has(data)).toBe(true);
    });

    it("should not add duplicate BudData to nextQueue", () => {
        bud.add(createBudData(1, 1, 1));
        bud.add(createBudData(1, 1, 1)); // Ccreate twice to avoid reference equality
        expect((bud as any).nextQueue.size).toBe(1);
    });

    it("should sort and filter the queue correctly", () => {
        const data1 = createBudData(1, 1, 1);
        const data2 = createBudData(2, 1, 1, 1, 1);
        const data3 = createBudData(2, 1, 1, 1);

        bud.add(data1);
        bud.add(data2);
        bud.add(data3);

        (bud as any).prepareQueue();

        const { queue } = bud as any;

        expect(queue).toEqual([data3, data1]);
        expect((bud as any).nextQueue.has(data2)).toBe(true);
        expect((bud as any).nextQueue.size).toBe(1);
    });

    it("should update blocks in the queue", () => {
        const data = createBudData(1, 1, 1);

        bud.add(data);
        bud.update();
        bud.update();

        const expected = getPlaneAdjacent({ x: 1, y: 1, z: 1 }).sort(
            (a, b) => {
                if (a.x !== b.x) return a.x - b.x;
                if (a.y !== b.y) return a.y - b.y;
                return a.z - b.z;
            }
        );
        expected.unshift({ x: 1, y: 1, z: 1 });

        expect(updatedBlockPoses).toEqual(expected);
    });

    it("should ignore the repeated blocks in the queue", () => {
        const data = createBudData(1, 1, 1);
        const data2 = createBudData(1, 1, 1);
        bud.add(data);
        bud.add(data2);
        expect((bud as any).nextQueue.size).toBe(1);
    });

    it("should not add new data when the queue is full", () => {
        for (let i = 0; i < 105; i++) {
            bud.add(createBudData(i, i, i));
        }

        (bud as any).prepareQueue();
        expect((bud as any).queue.length).toBe(100);
        expect((bud as any).nextQueue.size).toBe(5);
    });

    it("should skip the updated blocks in the nextQueue", () => {
        const data = createBudData(1, 1, 1);
        bud.add(createBudData(1, 1, 1));
        bud.update();
        expect((bud as any).nextQueue).not.toContain(data); // Check if the data is removed
        bud.add(createBudData(1, 1, 1));
        expect((bud as any).nextQueue).not.toContain(data);
    });

    it("should clear the queue", () => {
        const data = createBudData(1, 1, 1);
        bud.add(data);
        bud.clear();
        expect((bud as any).queue.length).toBe(0);
        expect((bud as any).nextQueue.size).toBe(0);
        expect((bud as any).updatedBlockPos.size).toBe(0);
    });
});
