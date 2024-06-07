import { Block, BlockPos } from "@/map/block";
import { Chunk, ChunkPos } from "@/map/chunk";
import { Generator3D } from "@/map/generator/3d";
import { generate2DArray } from "@/map/utils";

/**
 * The configuration for a dimension in the world.
 */
type DimensionConfig = {
    /**
     * The ID of the dimension.
     */
    id: string;
    /**
     * The generator for the dimension.
     */
    generator: Generator3D;
    /**
     * The chunks in the dimension.
     * Key is the chunk position in the format `x,y`.
     */
    chunks?: { [key: string]: Chunk };
};

/**
 * A dimension in the world.
 * @class
 * @implements {DimensionInterface}
 * @extends {DimensionConfig}
 */
class Dimension {
    /**
     * The ID of the dimension.
     */
    id: string;
    /**
     * The chunks in the dimension.
     *
     * Key is the chunk position in the format `x,y`.
     */
    chunks: { [key: string]: Chunk };
    /**
     * The generator for the dimension.
     * @private
     */
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
     * Checks if a chunk exists at a specific position.
     * @param pos - The position of the chunk.
     * @returns `true` if the chunk exists, `false` otherwise.
     */
    hasChunk(pos: ChunkPos): boolean {
        return `${pos.x},${pos.y}` in this.chunks;
    }

    /**
     * Retrieves the chunk containing a block at a specific position.
     * @param pos - The position of the block.
     * @param generate - If `true`, generates the chunk if it doesn't exist. Defaults to `true`.
     * @returns The chunk containing the block, or `null` if it doesn't exist and generate is `false`.
     */
    getChunkFromBlockPos(pos: BlockPos, generate = true): Chunk | null {
        const chunkPos = {
            x: Math.floor(pos.x / Chunk.SIZE),
            y: Math.floor(pos.y / Chunk.SIZE)
        };

        return this.getChunkFromChunkPos(chunkPos, generate);
    }

    /**
     * Retrieves the chunk at a specific position.
     * @param pos - The position of the chunk.
     * @param generate - If `true`, generates the chunk if it doesn't exist. Defaults to `true`.
     * @returns The chunk at the given position, or `null` if it doesn't exist and generate is `false`.
     */
    getChunkFromChunkPos(pos: ChunkPos, generate = true): Chunk | null {
        const chunk = this.chunks[`${pos.x},${pos.y}`];
        if (!chunk && generate) {
            return this.generateChunk(pos);
        }

        return chunk || null;
    }

    /**
     * Retrieves all chunks within a certain radius around a position.
     * @param pos - The center position.
     * @param radius - The radius around the center.
     * @param generate - If `true`, generates any chunks within the radius that don't exist. Defaults to `true`.
     * @returns An array of chunks within the radius.
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
     * Generates a new chunk at a specific position.
     * @param pos - The position of the new chunk.
     * @returns The newly generated chunk.
     */
    generateChunk(pos: ChunkPos): Chunk {
        const chunk = this.generator.generateChunk(pos);
        this.chunks[`${pos.x},${pos.y}`] = chunk;
        return chunk;
    }

    /**
     * Retrieves the block at a specific position.
     * @param pos - The position of the block.
     * @param generate - If `true`, generates the chunk containing the block if it doesn't exist. Defaults to `true`.
     * @returns The block at the given position, or `null` if it doesn't exist and generate is `false`.
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
     * Sets a block at a specific position.
     * @param pos - The position of the block.
     * @param block - The block to set.
     * @param generate - If `true`, generates the chunk containing the block if it doesn't exist. Defaults to `true`.
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

export { Dimension, DimensionConfig };
