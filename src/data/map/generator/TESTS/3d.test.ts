import { Block, BlockPos } from "@/data/map/block";
import { Chunk } from "@/data/map/chunk";
import { Generator3D } from "@/data/map/generator/3d";
import { traverse3DArray } from "@/data/map/utils";

describe("MapGenerator", () => {
    let generator3D: Generator3D;

    beforeEach(() => {
        generator3D = new Generator3D("testSeed");
    });

    it("should generate a block array for z-axis", () => {
        const pos = { x: 1, y: 2 };
        const blocks = generator3D.generateZAxis(pos);
        expect(blocks).toHaveLength(Chunk.HEIGHT);
    });

    it("should generate a chunk with correct position and blocks", () => {
        const pos = { x: 1, y: 2 };

        // Mock the generateBlock method, to check whether the positions are correct.
        generator3D.generateZAxis = jest.fn(
            (pos: { x: number; y: number }) => {
                const blocks: Block[] = [];
                for (let i = 0; i < Chunk.HEIGHT; i++) {
                    blocks.push(
                        new Block(JSON.stringify({ x: pos.x, y: pos.y, z: i }))
                    );
                }

                return blocks;
            }
        );

        const chunk = generator3D.generateChunk(pos);

        expect(chunk).toBeInstanceOf(Chunk);
        expect(chunk.pos).toEqual(pos);
        expect(chunk.blocks).toHaveLength(Chunk.SIZE);
        traverse3DArray(chunk.blocks, (block, relativePos: BlockPos) => {
            // Check if the block is an instance of Block
            expect(block).toBeInstanceOf(Block);

            // Check if the block position is correct
            const absolutePos = {
                x: chunk.relativeToAbsolutePosition(relativePos).x,
                y: chunk.relativeToAbsolutePosition(relativePos).y,
                z: relativePos.z
            };
            expect(block.type).toEqual(JSON.stringify(absolutePos));
        });
    });
});
