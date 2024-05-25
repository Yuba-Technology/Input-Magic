import { Block, BlockPos } from "@/map/block";
import { Entity } from "@/entity/entity";

const CHUNK_SIZE = 16;
const CHUNK_HEIGHT = 16;

/**
 * Relative block position inside a chunk
 * @typedef {Object} RelativeBlockPos
 * @property {number} x - The relative x-coordinate of the block.
 * @property {number} y - The relative y-coordinate of the block.
 * @property {number} z - The relative z-coordinate of the block.
 */
type RelativeBlockPos = {
    x: number;
    y: number;
    z: number;
};

/**
 * The position of a chunk in the world.
 * @typedef {Object} ChunkPos
 * @property {number} x - The x-coordinate of the chunk.
 * @property {number} y - The y-coordinate of the chunk.
 */
type ChunkPos = {
    x: number;
    y: number;
};

/**
 * The configuration for a chunk in the world.
 * @typedef {Object} ChunkConfig
 * @property {ChunkPos} pos - The position of the chunk.
 * @property {Block[][][]} blocks - The blocks in the chunk.
 * @property {Entity[]} entities - The entities in the chunk.
 */
type ChunkConfig = {
    pos: ChunkPos;
    blocks: Block[][][];
    entities?: Entity[];
};

/**
 * The interface for a chunk in the world.
 * @interface ChunkInterface
 * @property {ChunkPos} pos - The position of the chunk.
 * @property {Block[][][]} blocks - The blocks in the chunk.
 * @property {Entity[]} entities - The entities in the chunk.
 * @method absoluteToRelativePosition - Convert an absolute position to a relative position inside the chunk.
 * @method relativeToAbsolutePosition - Convert a relative position inside the chunk to an absolute position.
 * @extends {ChunkConfig}
 */
interface ChunkInterface {
    pos: ChunkPos;
    blocks: Block[][][];
    entities: Entity[];
    absoluteToRelativePosition(pos: BlockPos): RelativeBlockPos;
    relativeToAbsolutePosition(pos: RelativeBlockPos): BlockPos;
}

/**
 * A chunk in the world.
 * @class
 * @implements {ChunkInterface}
 * @extends {ChunkConfig}
 */
class Chunk implements ChunkInterface {
    static SIZE = CHUNK_SIZE;
    static HEIGHT = CHUNK_HEIGHT;
    pos: ChunkPos;
    blocks: Block[][][];
    entities: Entity[];

    /**
     * @constructor
     * @param config - The configuration for the chunk.
     */
    constructor(config: ChunkConfig) {
        this.pos = config.pos;
        this.blocks = config.blocks;
        this.entities = config.entities || [];
    }

    /**
     * Convert an absolute position to a relative position inside the chunk.
     * @param pos The absolute position.
     * @returns The relative position inside the chunk.
     */
    absoluteToRelativePosition(pos: BlockPos): RelativeBlockPos {
        const relativeX =
            pos.x < 0 ? (pos.x % Chunk.SIZE) + Chunk.SIZE : pos.x % Chunk.SIZE;
        const relativeY =
            pos.y < 0 ? (pos.y % Chunk.SIZE) + Chunk.SIZE : pos.y % Chunk.SIZE;

        return {
            x: relativeX === 16 ? 0 : relativeX,
            y: relativeY === 16 ? 0 : relativeY,
            z: pos.z // z is the same in both relative and absolute positions
        };
    }

    /**
     * Convert a relative position inside the chunk to an absolute position.
     * @param pos The relative position inside the chunk.
     * @returns The absolute position.
     */
    relativeToAbsolutePosition(pos: RelativeBlockPos): BlockPos {
        return {
            x: pos.x + this.pos.x * Chunk.SIZE,
            y: pos.y + this.pos.y * Chunk.SIZE,
            z: pos.z // z is the same in both relative and absolute positions
        };
    }
}

export { Chunk, ChunkInterface, ChunkPos, ChunkConfig };
