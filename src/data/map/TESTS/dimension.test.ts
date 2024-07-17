import { BlockPos } from "@/data/map/block";
import { Chunk, ChunkPos } from "@/data/map/chunk";
import { Dimension } from "@/data/map/dimension";
import { chebyshevDistance, generate2DArray } from "@/data/map/utils";

const chunkPos: ChunkPos = { x: 0, y: 0 };
const invalidChunkPos: ChunkPos = { x: 2, y: 2 };

const Generator3D = jest.fn().mockImplementation(() => {
    return {
        seed: "testSeed",
        generateBlock: jest.fn(
            (pos: BlockPos) => new Chunk({ pos, blocks: [[[]]] })
        ),
        generateChunk: jest.fn(
            (pos: ChunkPos) => new Chunk({ pos, blocks: [[[]]] })
        )
    };
});

describe("Dimension class", () => {
    let dimension: Dimension;

    beforeEach(() => {
        dimension = new Dimension({
            id: "test",
            chunks: { "0,0": new Chunk({ pos: chunkPos, blocks: [[[]]] }) },
            generator: new Generator3D()
        });
    });

    // Test chunk checker (hasChunk method)
    it("should check if a chunk exists at the given position", () => {
        // Existing chunk
        expect(dimension.hasChunk(chunkPos)).toBe(true);

        // Non-existing chunk
        expect(dimension.hasChunk(invalidChunkPos)).toBe(false);
    });

    // Test chunk getter with block position (getChunkFromBlockPos method)
    it("should get the chunk that contains the given block position", () => {
        // Existing chunk
        const blockPos: BlockPos = { x: 0, y: 0, z: 0 };
        expect(dimension.getChunkFromBlockPos(blockPos)!.pos).toBe(chunkPos);

        // Non-existing chunk
        const blockPosAtNewChunk: BlockPos = {
            x: -1 - Chunk.SIZE,
            y: -1 - Chunk.SIZE,
            z: -1 - Chunk.SIZE
        };

        // Non-existing chunk, disallow generation
        expect(
            dimension.getChunkFromBlockPos(blockPosAtNewChunk, false)
        ).toBeNull();

        // Non-existing chunk, allow generation
        const newChunk = dimension.getChunkFromBlockPos(blockPosAtNewChunk);
        expect(newChunk).toBeInstanceOf(Chunk);
        expect(newChunk!.pos).toEqual({ x: -2, y: -2 });
    });

    // Test chunk getter with chunk position (getChunkFromChunkPos method)
    it("should get the chunk at the given position", () => {
        // Existing chunk
        expect(dimension.getChunkFromChunkPos(chunkPos)!.pos).toBe(chunkPos);

        // Non-existing chunk, disallow generation
        expect(
            dimension.getChunkFromChunkPos({ x: 2, y: 2 }, false)
        ).toBeNull();
    });

    // Test chunk getter with radius (getChunksInRadius method)
    it("should get all chunks in the given radius", () => {
        const centerPos: ChunkPos = { x: 0, y: 0 };
        const radius = 2;

        const checkChunks = (
            expected: { x: number; y: number }[],
            actual: Chunk[]
        ) => {
            expect(actual).toHaveLength(expected.length);
            for (const chunk of actual) {
                const distance = chebyshevDistance(centerPos, chunk.pos);
                expect(distance).toBeLessThanOrEqual(radius);

                // After we find the chunk, remove it from the expected positions
                // And finally, we should have an empty `expectedPositions` array
                // Because we want to make sure that there are no extra/missing/repeated chunks
                expected.splice(expected.indexOf(chunk.pos), 1);
            }

            expect(expected).toHaveLength(0);
        };

        // ----------------------------------------------------------
        // 1. Some chunks not exist, disallow generation

        // Generate surrounding chunks
        const _surroundingChunks = generate2DArray(
            { x: (radius - 1) * 2 + 1, y: (radius - 1) * 2 + 1 },
            (pos) => {
                dimension.generateChunk({
                    x: centerPos.x + pos.x,
                    y: centerPos.y + pos.y
                });
            }
        );

        // Generate expected positions
        // expected ignore the missing chunks
        const expectedPositions1 = generate2DArray(
            { x: (radius - 1) * 2 + 1, y: (radius - 1) * 2 + 1 },
            (pos) => pos
        ).flat();

        // Get chunks in radius
        const chunks = dimension.getChunksInRadius(centerPos, radius, false);
        checkChunks(expectedPositions1, chunks);

        // ----------------------------------------------------------
        // 2. Some chunks not exist, allow generation

        // Generate expected positions
        // expected auto generate the missing chunks
        const expectedPositions2 = generate2DArray(
            { x: radius * 2 + 1, y: radius * 2 + 1 },
            (pos) => pos
        ).flat();

        // Get chunks in radius
        const chunks2 = dimension.getChunksInRadius(centerPos, radius);
        checkChunks(expectedPositions2, chunks2);

        // ----------------------------------------------------------
        // 3. All chunks exist

        // Get chunks in radius
        // We don't use `expectedPositions2` here, because now after the `checkChunks` function,
        // `expectedPositions2` should be empty.
        const expectedPositions3 = generate2DArray(
            { x: radius * 2 + 1, y: radius * 2 + 1 },
            (pos) => pos
        ).flat();
        const chunks3 = dimension.getChunksInRadius(centerPos, radius, false);
        checkChunks(expectedPositions3, chunks3);

        // ----------------------------------------------------------
        // 4. Empty radius
        expect(dimension.getChunksInRadius(centerPos, 0)).toHaveLength(1);
    });

    // Test chunk generation (generateChunk method)
    it("should generate a new chunk properly", () => {
        const newChunkPos: ChunkPos = { x: 1, y: 1 };
        expect(dimension.generateChunk(newChunkPos)).toBeInstanceOf(Chunk);
        expect(dimension.hasChunk(newChunkPos)).toBe(true);

        const newChunk = dimension.generateChunk(newChunkPos);
        expect(newChunk).toBeInstanceOf(Chunk);
        expect(newChunk.pos).toEqual(newChunkPos);
    });

    // Test block getter (getBlock method)
    it("should get a block at the given position", () => {
        // Existing chunk
        const pos: BlockPos = { x: 0, y: 0, z: 0 };
        const block = dimension.getBlock(pos);
        // Use find method to find the same block from the chunk's blocks
        const depth3D = 2;
        const foundBlock = dimension
            .getChunkFromBlockPos(pos)!
            .blocks.flat(depth3D)
            .find((b) => b === block);
        expect(foundBlock).toBe(block);

        // Non-existing chunk, disallow generation
        const nonExistingPos: BlockPos = { x: 16, y: -16, z: 0 };
        expect(dimension.getBlock(nonExistingPos, false)).toBeNull();

        // Non-existing chunk, allow generation
        const newBlock = dimension.getBlock(nonExistingPos);
        expect(dimension.getChunkFromChunkPos({ x: 1, y: -1 })).toBeInstanceOf(
            Chunk
        );
        // Use find method to find the same block from the chunk's blocks
        const foundNewBlock = dimension
            .getChunkFromBlockPos(nonExistingPos)!
            .blocks.flat(depth3D)
            .find((b) => b === newBlock);
        expect(foundNewBlock).toBe(newBlock);
    });

    // Test block setter (setBlock method)
    it("should set a block at the given position", () => {
        // Existing chunk
        const pos: BlockPos = { x: 0, y: 0, z: 0 };
        const newBlock = { type: "guess-what-it-is" };
        dimension.setBlock(pos, newBlock);

        // Use find method to find the same block from the chunk's blocks
        const depth3D = 2;
        const foundBlock = dimension
            .getChunkFromBlockPos(pos)!
            .blocks.flat(depth3D)
            .find((b) => b === newBlock);
        expect(foundBlock).toBe(newBlock);

        // Non-existing chunk, disallow generation
        const nonExistingPos: BlockPos = { x: 16, y: -16, z: 0 };
        const newBlock2 = { type: "another-guess" };
        dimension.setBlock(nonExistingPos, newBlock2, false);
        expect(dimension.getBlock(nonExistingPos, false)).toBeNull();

        // Non-existing chunk, allow generation
        dimension.setBlock(nonExistingPos, newBlock2);
        expect(dimension.getBlock(nonExistingPos)).toBe(newBlock2);
    });
});
