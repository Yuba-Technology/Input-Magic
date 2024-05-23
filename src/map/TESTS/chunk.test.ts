import { Chunk } from "@/map/chunk";

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
});
