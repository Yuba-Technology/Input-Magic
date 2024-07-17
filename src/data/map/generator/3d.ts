import { Block, EmptyBlock, LiquidBlock } from "@/data/map/block";
import { Chunk, ChunkPos } from "@/data/map/chunk";
import { generate2DArray } from "@/data/map/utils";
import { PerlinNoise } from "@/data/map/generator/noise";

/**
 * A 3D map generator.
 * @class
 */
class Generator3D {
    seed: string;
    noise: PerlinNoise;

    /**
     * @constructor
     * @param seed - The seed for the map generator.
     */
    constructor(seed: string) {
        this.seed = seed;
        this.noise = new PerlinNoise({ seed });
    }

    /**
     * Generate the blocks for the z-axis at the given position.
     * @param pos The z-axis position of the chunk.
     * @returns The generated blocks for the z-axis.
     */
    generateZAxis(pos: { x: number; y: number }) {
        const blocks: Block[] = [];
        const maxGroundHeight = (3 / 4) * Chunk.HEIGHT; // Keep 1/4 of the chunk for air
        const noise = this.noise.noise2d(pos.x, pos.y);
        // Actual ground height
        const groundHeight = Math.floor(maxGroundHeight * noise);
        const mountLevel = (5 / 6) * maxGroundHeight;
        const seaLevel = (1 / 3) * maxGroundHeight;

        // 1. Ground height < sea level: Ocean, replace the air with water, and the ground with sand for 1 block
        // 2. Ground height == sea level: replace grass and dirt with sand
        // 3. Ground height > sea level && < mount level: from top: 1grass, 1-2 dirt(2 when ground height > sea level + 2), else stones
        // 4. Ground height >= mount level: from top: 1 snow, 1grass, 2 dirts, else stones

        // Ocean
        if (groundHeight < seaLevel) {
            while (blocks.length < groundHeight) {
                blocks.push(new Block("stone"));
            }

            blocks.push(new Block("sand"));

            while (blocks.length <= seaLevel) {
                blocks.push(new LiquidBlock("water"));
            }

            while (blocks.length < Chunk.HEIGHT) {
                blocks.push(new EmptyBlock("air"));
            }
        }

        // Sea level
        if (groundHeight === seaLevel) {
            while (blocks.length < groundHeight) {
                blocks.push(new Block("stone"));
            }

            blocks.push(new Block("sand"));

            while (blocks.length < Chunk.HEIGHT) {
                blocks.push(new EmptyBlock("air"));
            }
        }

        // Ground height > sea level && < mount level
        if (groundHeight > seaLevel && groundHeight < mountLevel) {
            if (groundHeight < mountLevel) {
                while (blocks.length < groundHeight) {
                    blocks.push(new Block("stone"));
                }

                for (
                    let i = 0;
                    i < (groundHeight > seaLevel + 2 ? 2 : 1);
                    i++
                ) {
                    blocks.push(new Block("dirt"));
                }

                blocks.push(new Block("grass"));

                while (blocks.length < Chunk.HEIGHT) {
                    blocks.push(new EmptyBlock("air"));
                }
            }

            // Mount level
            if (groundHeight >= mountLevel) {
                while (blocks.length < groundHeight) {
                    blocks.push(new Block("stone"));
                }

                blocks.push(
                    new Block("dirt"),
                    new Block("grass"),
                    new Block("snow")
                );

                while (blocks.length < Chunk.HEIGHT) {
                    blocks.push(new EmptyBlock("air"));
                }
            }
        }

        return blocks;
    }

    /**
     * Generate a chunk at the given chunk position.
     * @param pos The position of the chunk to be generated.
     * @returns The generated chunk.
     */
    generateChunk(pos: ChunkPos) {
        const chunk = new Chunk({ pos, blocks: [] });
        const blocks = generate2DArray(
            { x: Chunk.SIZE, y: Chunk.SIZE },
            (relativePos) => {
                const absolutePos = chunk.relativeToAbsolutePosition({
                    ...relativePos,
                    z: 0
                });
                return this.generateZAxis(absolutePos);
            }
        );

        chunk.blocks = blocks;

        return chunk;
    }
}

export { Generator3D };
