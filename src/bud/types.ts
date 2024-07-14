import { BlockPos } from "@/map/block";
import { Dimension } from "@/map/dimension";

/**
 * The type of the bud. The higher the value, the more priority it has.
 */
enum BudType {
    NORMAL,
    POWERED
}

type BudData = {
    /**
     * The dimension of the block to be updated.
     */
    dimension: Dimension;
    /**
     * The position of the block to be updated.
     */
    pos: BlockPos;
    /**
     * The type of the bud.
     */
    type: BudType;
    /**
     * After what tick the block should be updated.
     */
    delay?: number;
};

interface BudUpdater {
    handleBud(data: BudData): void;
}

export { BudType, BudData, BudUpdater };
