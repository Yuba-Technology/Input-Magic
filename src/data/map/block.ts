/**
 * A block's position in the world.
 */
type BlockPos = {
    x: number;
    y: number;
    z: number;
};

interface BlockSharedProperties {
    /**
     * The hardness of the block.
     */
    hardness: number;
}

interface LiquidBlockSharedProperties extends BlockSharedProperties {
    /**
     * How far the fluid can flow.
     */
    flowDistance: number;
    /**
     * The position of the source block.
     */
    sourcePos: BlockPos;
}

interface SpreadableBlockSharedProperties extends BlockSharedProperties {
    /**
     * The chance of the block spreading.
     */
    spreadChance: number;
    /**
     * The spread radius of the block, only blocks within this radius can be spread.
     */
    spreadRadius: number;
}

interface BlockUniqueProperties {}

interface LiquidBlockUniqueProperties extends BlockUniqueProperties {
    /**
     * The position of the source block.
     */
    saucePos: BlockPos;
}

interface SpreadableBlockUniqueProperties extends BlockUniqueProperties {}

/**
 * A block in the world.
 */
class Block {
    /**
     * The type of the block.
     */
    type: string;
    uniqueProperties?: BlockUniqueProperties = undefined;

    /**
     * @constructor
     * @param pos - The position of the block.
     * @param type - The type of the block.
     */
    constructor(type: string) {
        this.type = type;
    }
}

/**
 * An empty block in the world, like air.
 */
class EmptyBlock extends Block {}

class LiquidBlock extends Block {
    uniqueProperties?: LiquidBlockUniqueProperties = undefined;
}

class SpreadableBlock extends Block {
    uniqueProperties?: SpreadableBlockUniqueProperties = undefined;
}

export {
    BlockPos,
    Block,
    EmptyBlock,
    LiquidBlock,
    SpreadableBlock,
    BlockSharedProperties,
    LiquidBlockSharedProperties,
    SpreadableBlockSharedProperties,
    BlockUniqueProperties,
    LiquidBlockUniqueProperties,
    SpreadableBlockUniqueProperties
};
