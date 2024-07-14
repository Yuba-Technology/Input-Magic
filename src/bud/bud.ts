import { BlockPos } from "@/map/block";
import { TickerTask } from "@/tick/types";
import { eventBus, EventData } from "@/event-bus";
import { elementInSet } from "@/utils";
import { BudData } from "@/bud/types";
import BudHandlerFactory from "@/bud/factory";

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
     * Get the singleton instance of the BUD.
     */
    static getInstance(): BUD {
        BUD.instance ||= new BUD();
        return BUD.instance;
    }

    /**
     * Add a block to the queue.
     * @param data The data to be added to the queue.
     */
    add(data: BudData): void {
        if (elementInSet(data, this.nextQueue)) return;

        this.nextQueue.add(data);
    }

    /**
     * Prepare the queue for this tick to update.
     */
    private prepareQueue(): void {
        this.queue = [];

        for (const data of this.nextQueue) {
            // !No break here! We need to update all the delays here in the `nextQueue`!
            if (data.delay && --data.delay > 0) continue;
            if (this.queue.length >= BUD.QUEUE_MAX_LENGTH) continue;
            this.queue.push(data);
            this.nextQueue.delete(data);
        }

        // Sort by:
        // 1. task priority
        // 2. pos (x, y, z)
        this.queue.sort((a, b) => {
            if (a.type !== b.type) return a.type - b.type;
            if (a.pos.x !== b.pos.x) return a.pos.x - b.pos.x;
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

        const updatedBlockPos = new Set<BlockPos>();
        for (const bud of this.queue) {
            updatedBlockPos.add(bud.pos);
        }

        return updatedBlockPos;
    }
}

const bud = BUD.getInstance();

eventBus.on("bud:add", (data: EventData) => {
    bud.add(data as BudData);
});

export { bud };
