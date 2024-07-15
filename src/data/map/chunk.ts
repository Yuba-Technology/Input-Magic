import { Block, BlockPos } from "@/data/map/block";
import { Entity } from "@/data/entity/entity";

const CHUNK_SIZE = 16;
const CHUNK_HEIGHT = 16;

/**
 * Relative block position inside a chunk.
 */
type RelativeBlockPos = {
    x: number;
    y: number;
    z: number;
};

/**
 * The position of a chunk in the world.
 */
type ChunkPos = {
    x: number;
    y: number;
};

/**
 * The configuration for a chunk in the world.
 */
type ChunkConfig = {
    /**
     * The position of the chunk.
     */
    pos: ChunkPos;
    /**
     * The blocks in the chunk.
     */
    blocks: Block[][][];
    /**
     * The entities in the chunk.
     */
    entities?: Entity[];
};

/**
 * A chunk in the world.
 * @class
 * @implements {ChunkInterface}
 */
class Chunk {
    /**
     * The size of the chunk, x length and y length.
     */
    static SIZE = CHUNK_SIZE;
    /**
     * The height of the chunk, z length.
     */
    static HEIGHT = CHUNK_HEIGHT;
    /**
     * The position of the chunk.
     */
    pos: ChunkPos;
    /**
     * The blocks in the chunk.
     */
    blocks: Block[][][];
    /**
     * The entities in the chunk.
     */
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

export { Chunk, ChunkPos, ChunkConfig };
