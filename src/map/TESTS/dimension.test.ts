import { BlockPos } from "@/map/block";
import { Chunk, ChunkPos } from "@/map/chunk";
import { Dimension } from "@/map/dimension";

const chunkPos: ChunkPos = { x: 0, y: 0 };
const invalidChunkPos: ChunkPos = { x: 2, y: 2 };

describe("Dimension class", () => {
    let dimension: Dimension;

    beforeEach(() => {
        dimension = new Dimension({
            id: "test",
            chunks: { "0,0": new Chunk({ pos: chunkPos, blocks: [[[]]] }) }
        });
    });

    it("should check if a chunk exists at the given position", () => {
        // Existing chunk
        expect(dimension.hasChunk(chunkPos)).toBe(true);

        // Non-existing chunk
        expect(dimension.hasChunk(invalidChunkPos)).toBe(false);
    });

    it("should get the chunk that contains the given block position", () => {
        // Existing chunk
        const blockPos: BlockPos = { x: 0, y: 0, z: 0 };
        expect(dimension.getChunkFromBlockPos(blockPos)!.pos).toBe(chunkPos);

        // Non-existing chunk
        const blockPosAtNewChunk: BlockPos = {
            x: 0 + Chunk.CHUNK_SIZE,
            y: 0 + Chunk.CHUNK_SIZE,
            z: 0 + Chunk.CHUNK_SIZE
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

    it("should get the chunk at the given position", () => {
        // Existing chunk
        expect(dimension.getChunkFromChunkPos(chunkPos)!.pos).toBe(chunkPos);

        // Non-existing chunk, disallow generation
        expect(
            dimension.getChunkFromChunkPos({ x: 2, y: 2 }, false)
        ).toBeNull();
    });

    it("should generate a new chunk properly", () => {
        const newChunkPos: ChunkPos = { x: 1, y: 1 };
        expect(dimension.generateChunk(newChunkPos)).toBeInstanceOf(Chunk);
        expect(dimension.hasChunk(newChunkPos)).toBe(true);

        const newChunk = dimension.generateChunk(newChunkPos);
        expect(newChunk).toBeInstanceOf(Chunk);
        expect(newChunk.pos).toEqual(newChunkPos);
    });
});
