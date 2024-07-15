import { Chunk } from "@/data/map/chunk";

describe("Chunk", () => {
    let chunk: Chunk;
    const mockConfig = {
        pos: { x: 1, y: 1 },
        blocks: [],
        entities: []
    };

    beforeEach(() => {
        chunk = new Chunk(mockConfig);
    });

    it("should be created with correct position", () => {
        expect(chunk.pos).toEqual(mockConfig.pos);
    });

    it("should be created with correct blocks", () => {
        expect(chunk.blocks).toEqual(mockConfig.blocks);
    });

    it("should be created with correct entities", () => {
        expect(chunk.entities).toEqual(mockConfig.entities);
    });

    // Position conversion tests
    it("should convert absolute position to relative position", () => {
        const pos = { x: 3, y: 16, z: 3 };
        const relativePos = chunk.absoluteToRelativePosition(pos);

        expect(relativePos).toEqual({ x: 3, y: 0, z: 3 });

        // Negative position
        chunk.pos = { x: -2, y: -1 };
        const negPos = { x: -32, y: -1, z: 3 };
        const negRelativePos = chunk.absoluteToRelativePosition(negPos);

        expect(negRelativePos).toEqual({ x: 0, y: 15, z: 3 });
    });

    it("should convert relative position to absolute position", () => {
        const relativePos = { x: 3, y: 0, z: 3 };
        const pos = chunk.relativeToAbsolutePosition(relativePos);

        expect(pos).toEqual({ x: 19, y: 16, z: 3 });

        // Negative position
        chunk.pos = { x: -2, y: -1 };
        const negRelativePos = { x: 0, y: 15, z: 3 };
        const negPos = chunk.relativeToAbsolutePosition(negRelativePos);

        expect(negPos).toEqual({ x: -32, y: -1, z: 3 }); // The rightmost block in the (-2,-1)
    });
});
