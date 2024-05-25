/**
 * The position of a block in the world.
 * @typedef {Object} BlockPos
 * @property {number} x - The x-coordinate of the block.
 * @property {number} y - The y-coordinate of the block.
 * @property {number} z - The z-coordinate of the block.
 */
type BlockPos = {
    x: number;
    y: number;
    z: number;
};

/**
 * The interface for a block in the world.
 * @interface BlockInterface
 * @property {BlockPos} pos - The position of the block.
 * @property {string} type - The type of the block.
 */
interface BlockInterface {
    type: string; // The type of the block.
}

/**
 * A block in the world.
 * @class
 */
class Block implements BlockInterface {
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

export { Block, BlockInterface, BlockPos };
