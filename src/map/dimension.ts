import { Block, BlockPos } from "@/map/block";
import { Chunk, ChunkPos } from "@/map/chunk";
import { Generator3D } from "@/map/generator/3d";
import { generate2DArray } from "@/map/utils";

/**
 * The configuration for a dimension in the world.
 * @typedef {Object} DimensionConfig
 * @property {string} id - The ID of the dimension.
 * @property {{ [key: string]: Chunk }} chunks - The chunks in the dimension.
 */
type DimensionConfig = {
    id: string;
    chunks?: { [key: string]: Chunk }; // The chunks in the dimension. Key is the chunk position in the format "x,y".
    generator: Generator3D;
};

/**
 * The interface for a dimension in the world.
 * @interface DimensionInterface
 * @property {string} id - The ID of the dimension.
 * @property {{ [key: string]: Chunk }} chunks - The chunks in the dimension.
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
    // Get chunks in a radius around the given position.
    // Uses Chebyshev distance.
    getChunksInRadius(pos: ChunkPos, radius: number): Chunk[];
    // Check if a chunk exists at the given position.
    hasChunk(pos: ChunkPos): boolean;
    // Generate a new chunk at the given position.
    generateChunk(pos: ChunkPos): Chunk;
    // Get a block at the given position.
    getBlock(pos: BlockPos, generate: boolean): Block | null;
    // Set a block at the given position.
    setBlock(pos: BlockPos, block: Block, generate: boolean): void;
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
    private generator: Generator3D;

    /**
     * @constructor
     * @param config - The configuration for the dimension.
     */
    constructor(config: DimensionConfig) {
        this.id = config.id;
        this.chunks = config.chunks || {};
        this.generator = config.generator;
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
     * @param generate Whether to generate the chunk if it doesn't exist. Default to true.
     * @returns The chunk that contains the block.
     */
    getChunkFromBlockPos(pos: BlockPos, generate = true): Chunk | null {
        const chunkPos = {
            x: Math.floor(pos.x / Chunk.SIZE),
            y: Math.floor(pos.y / Chunk.SIZE)
        };

        return this.getChunkFromChunkPos(chunkPos, generate);
    }

    /**
     * Get the chunk at the given position.
     * @param pos The position of the chunk.
     * @param generate Whether to generate the chunk if it doesn't exist. Default to true.
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
     * Get chunks in a radius around the given position.
     * Uses Chebyshev distance.
     * @param pos The position of the center.
     * @param radius The radius around the center.
     * @returns The chunk in the radius.
     */
    getChunksInRadius(
        pos: ChunkPos,
        radius: number,
        generate = true
    ): Chunk[] {
        const chunks: Chunk[] = generate2DArray(
            { x: radius * 2 + 1 + pos.x, y: radius * 2 + 1 + pos.y },
            (relativePos) => {
                const absolutePos = {
                    x: relativePos.x - radius,
                    y: relativePos.y - radius
                };

                return this.getChunkFromChunkPos(absolutePos, generate);
            }
        )
            .flat()
            // Use `is` to tell TypeScript that we will remove all null values in the `filter` function.
            .filter((chunk): chunk is Chunk => chunk !== null);

        return chunks;
    }

    /**
     * Generate a new chunk at the given position.
     * @param pos The position of the chunk to be generated.
     * @returns Generated new chunk.
     */
    generateChunk(pos: ChunkPos): Chunk {
        const chunk = this.generator.generateChunk(pos);
        this.chunks[`${pos.x},${pos.y}`] = chunk;
        return chunk;
    }

    /**
     * Get a block at the given position.
     * @param pos The position of the block.
     * @param generate Whether to generate the chunk if it doesn't exist. Default to true.
     * @returns The block at the given position.
     */
    getBlock(pos: BlockPos, generate = true): Block | null {
        const chunk = this.getChunkFromBlockPos(pos, generate);
        if (!chunk) {
            return null;
        }

        const relativePos = chunk.absoluteToRelativePosition(pos);
        // console.log(chunk, relativePos);
        return chunk.blocks[relativePos.x][relativePos.y][relativePos.z];
    }

    /**
     * Set a block at the given position.
     * @param pos The position of the block.
     * @param block The block to be set.
     * @param generate Whether to generate the chunk if it doesn't exist. Default to true.
     */
    setBlock(pos: BlockPos, block: Block, generate = true): void {
        const chunk = this.getChunkFromBlockPos(pos, generate);
        if (!chunk) {
            return;
        }

        const relativePos = chunk.absoluteToRelativePosition(pos);
        chunk.blocks[relativePos.x][relativePos.y][relativePos.z] = block;
    }
}

export { Dimension, DimensionInterface, DimensionConfig };
