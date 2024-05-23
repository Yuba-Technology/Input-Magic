import { Block } from "@/map/block";

describe("Block", () => {
    it("should correctly construct a block", () => {
        const pos = { x: 1, y: 2, z: 3 };
        const type = "testType";
        const block = new Block(pos, type);

        expect(block.pos).toEqual(pos);
        expect(block.type).toBe(type);
    });
});
