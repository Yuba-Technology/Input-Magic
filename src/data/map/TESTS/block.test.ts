import { Block } from "@/data/map/block";

describe("Block", () => {
    it("should correctly construct a block", () => {
        const type = "testType";
        const block = new Block(type);

        expect(block.type).toBe(type);
    });
});
