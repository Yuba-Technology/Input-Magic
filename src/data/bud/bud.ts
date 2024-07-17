import { BlockPos } from "@/data/map/block";
import { TickerTask } from "@/data/tick/types";
import { eventBus, EventData } from "@/data/event-bus";
import { elementInSet } from "@/data/utils";
import { BudData } from "@/data/bud/types";
import BudHandlerFactory from "@/data/bud/factory";

const QUEUE_MAX_LENGTH = 100;

/**
 * The Block Update Detector (BUD) class.
 */
class BUD implements TickerTask {
    /**
     * The priority of the BUD task.
     */
    priority: number = 100;
    /**
     * The maximum length of the BUD queue.
     */
    private static QUEUE_MAX_LENGTH: number = QUEUE_MAX_LENGTH;
    /**
     * The singleton instance of the BUD.
     */
    private static instance: BUD;
    /**
     * The queue of blocks to be updated.
     */
    private queue: BudData[] = [];
    /**
     * The queue of blocks to be updated in the next tick. It also contains the blocks that have a delay.
     */
    private nextQueue: Set<BudData> = new Set();
    /**
     * The updated block positions.
     */
    private updatedBlockPos: Set<BlockPos> = new Set();

    /**
     * Get the singleton instance of the BUD.
     */
    static getInstance(): BUD {
        BUD.instance ||= new BUD();
        return BUD.instance;
    }

    /**
     * Add a block to the queue.
     * @param data The data to be added to the queue.
     * @param skipIfUpdated If this pos already updated in this tick, don't add it to the queue. Defaults to `true`.
     */
    add(data: BudData, skipIfUpdated = true): void {
        if (elementInSet(data, this.nextQueue)) return;
        if (skipIfUpdated && elementInSet(data.pos, this.updatedBlockPos))
            return;

        this.nextQueue.add(data);
    }

    /**
     * Prepare the queue for this tick to update.
     */
    private prepareQueue(): void {
        this.queue = [];
        this.updatedBlockPos = new Set();

        for (const data of this.nextQueue) {
            // !No break here! We need to update all the delays here in the `nextQueue`!
            if (data.delay && data.delay-- > 0) continue;
            if (this.queue.length >= BUD.QUEUE_MAX_LENGTH) continue;
            this.queue.push(data);
            this.nextQueue.delete(data);
        }

        // Sort by:
        // 1. task priority
        // 2. pos (x, y, z)
        this.queue.sort((a, b) => {
            if (a.type !== b.type) return b.type - a.type; // higher type first
            if (a.pos.x !== b.pos.x) return a.pos.x - b.pos.x; // lower pos first
            if (a.pos.y !== b.pos.y) return a.pos.y - b.pos.y;
            return a.pos.z - b.pos.z;
        });
    }

    /**
     * Update the blocks in the queue.
     */
    update(): Set<BlockPos> {
        this.prepareQueue();

        for (const bud of this.queue) {
            BudHandlerFactory.getHandlerByType(bud.type).handleBud(bud);
        }

        for (const bud of this.queue) {
            this.updatedBlockPos.add(bud.pos);
        }

        return this.updatedBlockPos;
    }

    /**
     * Clear the BUD queue.
     */
    clear(): void {
        this.queue = [];
        this.nextQueue = new Set();
        this.updatedBlockPos = new Set();
    }
}

const bud = BUD.getInstance();

eventBus.on("bud:add", (data: EventData) => {
    bud.add(data as BudData);
});

export { bud };
