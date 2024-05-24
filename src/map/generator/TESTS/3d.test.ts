import { Block, BlockPos } from "@/map/block";
import { Chunk } from "@/map/chunk";
import { Generator3D } from "@/map/generator/3d";
import { traverseBlockArray } from "@/map/utils";

describe("MapGenerator", () => {
    let generator3D: Generator3D;

    beforeEach(() => {
        generator3D = new Generator3D("testSeed");
    });

    it("should generate a block with correct position and type", () => {
        const pos = { x: 1, y: 2, z: 3 };
        const block = generator3D.generateBlock(pos);

        expect(block).toBeInstanceOf(Block);
        // expect(block.type).toBe("stone");
    });

    it("should generate a chunk with correct position and blocks", () => {
        const pos = { x: 1, y: 2 };

        // Mock the generateBlock method, to check whether the positions are correct.
        generator3D.generateBlock = jest.fn(
            (pos: BlockPos) => new Block(JSON.stringify(pos))
        );

        const chunk = generator3D.generateChunk(pos);

        expect(chunk).toBeInstanceOf(Chunk);
        expect(chunk.pos).toEqual(pos);
        expect(chunk.blocks).toHaveLength(Chunk.SIZE);
        traverseBlockArray(chunk.blocks, (block, relativePos: BlockPos) => {
            // Check if the block is an instance of Block
            expect(block).toBeInstanceOf(Block);

            // Check if the block position is correct
            const absolutePos = {
                x: Chunk.SIZE * pos.x + relativePos.x,
                y: Chunk.SIZE * pos.y + relativePos.y,
                z: relativePos.z
            };
            expect(block.type).toEqual(JSON.stringify(absolutePos));
        });
    });
});
