import { BlockPos } from "@/map/block";
import { Chunk, ChunkPos } from "@/map/chunk";

/**
 * The configuration for a dimension in the world.
 * @typedef {Object} DimensionConfig
 * @property {string} id - The ID of the dimension.
 * @property {Chunk[]} [chunks] - The chunks in the dimension.
 */
type DimensionConfig = {
    id: string;
    chunks?: { [key: string]: Chunk }; // The chunks in the dimension. Key is the chunk position in the format "x,y".
};

/**
 * The interface for a dimension in the world.
 * @interface DimensionInterface
 * @property {string} id - The ID of the dimension.
 * @property {Chunk[]} chunks - The chunks in the dimension.
 */
interface DimensionInterface {
    // The ID of the dimension.
    id: string;
    // The chunks in the dimension. Key is the chunk position in the format "x,y".
    chunks: { [key: string]: Chunk };
    // Get the chunk that contains a block at the given position.
    // If generate is true, generate the chunk if it doesn't exist.
    // `generate` default to true.
    getChunkFromBlockPos(pos: BlockPos, generate: boolean): Chunk | null;
    // Get the chunk at the given position.
    // If generate is true, generate the chunk if it doesn't exist.
    // `generate` default to true.
    getChunkFromChunkPos(pos: ChunkPos, generate: boolean): Chunk | null;
    // Check if a chunk exists at the given position.
    hasChunk(pos: ChunkPos): boolean;
}

/**
 * A dimension in the world.
 * @class
 * @implements {DimensionInterface}
 * @extends {DimensionConfig}
 */
class Dimension implements DimensionInterface {
    id: string; // The ID of the dimension.
    chunks: { [key: string]: Chunk }; // The chunks in the dimension. Key is the chunk position in the format "x,y".

    /**
     * @constructor
     * @param config - The configuration for the dimension.
     */
    constructor(config: DimensionConfig) {
        this.id = config.id;
        this.chunks = config.chunks || {};
    }

    /**
     * Check if a chunk exists at the given position.
     * @param pos The position of the chunk.
     * @returns Whether the chunk exists.
     */
    hasChunk(pos: ChunkPos): boolean {
        return `${pos.x},${pos.y}` in this.chunks;
    }

    /**
     * Get the chunk that contains a block at the given position.
     * @param pos The position of the block.
     * @returns The chunk that contains the block.
     */
    getChunkFromBlockPos(pos: BlockPos, generate = true): Chunk | null {
        const chunkPos = {
            x: Math.floor(pos.x / Chunk.CHUNK_SIZE),
            y: Math.floor(pos.z / Chunk.CHUNK_SIZE)
        };
        return this.getChunkFromChunkPos(chunkPos, generate);
    }

    /**
     * Get the chunk at the given position.
     * @param pos The position of the chunk.
     * @returns The chunk at the given position.
     */
    getChunkFromChunkPos(pos: ChunkPos, generate = true): Chunk | null {
        const chunk = this.chunks[`${pos.x},${pos.y}`];
        if (!chunk && generate) {
            return this.generateChunk(pos);
        }

        return chunk || null;
    }

    /**
     * Generate a new chunk at the given position.
     * @param pos The position of the chunk to be generated.
     * @returns Generated new chunk.
     */
    generateChunk(pos: ChunkPos): Chunk {
        // TODO: Add generate blocks method.
        const chunk = new Chunk({ pos });
        this.chunks[`${pos.x},${pos.y}`] = chunk;
        return chunk;
    }
}

export { Dimension, DimensionInterface, DimensionConfig };
