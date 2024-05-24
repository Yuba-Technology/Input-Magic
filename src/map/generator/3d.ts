import { Block, BlockPos } from "@/map/block";
import { Chunk, ChunkPos } from "@/map/chunk";
import { generateBlockArray } from "@/map/utils";

/**
 * A 3D map generator.
 * @class
 */
class Generator3D {
    seed: string;

    /**
     * @constructor
     * @param seed - The seed for the map generator.
     */
    constructor(seed: string) {
        this.seed = seed;
    }

    /**
     * Generate a block at the given position.
     * @param pos The absolute position of the block.
     * @returns The generated block.
     */
    generateBlock(pos: BlockPos) {
        // TODO: Implement block generation based on seed.
        return new Block("stone");
    }

    /**
     * Generate a chunk at the given chunk position.
     * @param pos The position of the chunk to be generated.
     * @returns The generated chunk.
     */
    generateChunk(pos: ChunkPos) {
        const blocks = generateBlockArray(
            { x: Chunk.SIZE, y: Chunk.SIZE, z: Chunk.HEIGHT },
            (relativePos) => {
                const absolutePos = {
                    x: Chunk.SIZE * pos.x + relativePos.x,
                    y: Chunk.SIZE * pos.y + relativePos.y,
                    z: relativePos.z
                };
                return this.generateBlock(absolutePos);
            }
        );

        return new Chunk({ pos, blocks });
    }
}

export { Generator3D };
