import { BlockPos } from "@/map/block";
import { Chunk, ChunkPos } from "@/map/chunk";
import { Dimension } from "@/map/dimension";

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

    // Test chunk checker
    it("should check if a chunk exists at the given position", () => {
        // Existing chunk
        expect(dimension.hasChunk(chunkPos)).toBe(true);

        // Non-existing chunk
        expect(dimension.hasChunk(invalidChunkPos)).toBe(false);
    });

    // Test chunk getter with block position
    it("should get the chunk that contains the given block position", () => {
        // Existing chunk
        const blockPos: BlockPos = { x: 0, y: 0, z: 0 };
        expect(dimension.getChunkFromBlockPos(blockPos)!.pos).toBe(chunkPos);

        // Non-existing chunk
        const blockPosAtNewChunk: BlockPos = {
            x: 0 + Chunk.SIZE,
            y: 0 + Chunk.SIZE,
            z: 0 + Chunk.SIZE
        };

        // Non-existing chunk, disallow generation
        expect(
            dimension.getChunkFromBlockPos(blockPosAtNewChunk, false)
        ).toBeNull();

        // Non-existing chunk, allow generation
        const newChunk = dimension.getChunkFromBlockPos(blockPosAtNewChunk);
        expect(newChunk).toBeInstanceOf(Chunk);
        expect(newChunk!.pos).toEqual({ x: 1, y: 1 });
    });

    // Test chunk getter with chunk position
    it("should get the chunk at the given position", () => {
        // Existing chunk
        expect(dimension.getChunkFromChunkPos(chunkPos)!.pos).toBe(chunkPos);

        // Non-existing chunk, disallow generation
        expect(
            dimension.getChunkFromChunkPos({ x: 2, y: 2 }, false)
        ).toBeNull();
    });

    // Test chunk generation
    it("should generate a new chunk properly", () => {
        const newChunkPos: ChunkPos = { x: 1, y: 1 };
        expect(dimension.generateChunk(newChunkPos)).toBeInstanceOf(Chunk);
        expect(dimension.hasChunk(newChunkPos)).toBe(true);

        const newChunk = dimension.generateChunk(newChunkPos);
        expect(newChunk).toBeInstanceOf(Chunk);
        expect(newChunk.pos).toEqual(newChunkPos);
    });
});
