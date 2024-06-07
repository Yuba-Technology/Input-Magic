/**
 * A block's position in the world.
 */
type BlockPos = {
    x: number;
    y: number;
    z: number;
};

/**
 * A block in the world.
 * @class
 */
class Block {
    /**
     * The type of the block.
     */
    type: string;

    /**
     * @constructor
     * @param pos - The position of the block.
     * @param type - The type of the block.
     */
    constructor(type: string) {
        this.type = type;
    }
}

export { Block, BlockPos };
