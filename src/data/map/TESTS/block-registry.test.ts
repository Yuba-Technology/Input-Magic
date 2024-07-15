import { blockRegistry } from "@/data/map/block-registry";
import { basicBlocks } from "@/config/basic-blocks";

describe("BlockRegistry", () => {
    beforeEach(() => {
        blockRegistry.clear();
    });

    it("should instantiate a singleton instance", () => {
        expect(blockRegistry).not.toBeUndefined();
    });

    it("should register a block type and verify it is added", () => {
        const blockType = "testBlock";
        const sharedProperties = { hardness: 0.5 };
        blockRegistry.registerBlockType(blockType, sharedProperties);

        expect(blockRegistry.hasBlockType(blockType)).toBe(true);
    });

    it("should update the properties when the same block type is registered again", () => {
        const blockType = "testBlock";
        const sharedProperties = { hardness: 0.5 };
        const updatedProperties = { hardness: 0.8 };
        blockRegistry.registerBlockType(blockType, sharedProperties);
        blockRegistry.registerBlockType(blockType, updatedProperties);

        const properties = blockRegistry.getBlockTypeProperties(blockType);
        expect(properties).toEqual(updatedProperties);
    });

    it("should return true for registered block types and false for unregistered ones", () => {
        const registeredBlockType = "testBlock";
        const unregisteredBlockType = "fakeBlock";
        blockRegistry.registerBlockType(registeredBlockType, {
            hardness: 0.5
        });

        expect(blockRegistry.hasBlockType(registeredBlockType)).toBe(true);
        expect(blockRegistry.hasBlockType(unregisteredBlockType)).toBe(false);
    });

    it("should retrieve the correct properties for a registered block type and undefined for an unregistered block type", () => {
        const registeredBlockType = "testBlock";
        const unregisteredBlockType = "fakeBlock";
        const expectedProperties = { hardness: 0.5 };
        blockRegistry.registerBlockType(
            registeredBlockType,
            expectedProperties
        );

        const registeredProperties =
            blockRegistry.getBlockTypeProperties(registeredBlockType);
        const unregisteredProperties = blockRegistry.getBlockTypeProperties(
            unregisteredBlockType
        );

        expect(registeredProperties).toEqual(expectedProperties);
        expect(unregisteredProperties).toBeUndefined();
    });

    it("should clear all registered block types except all basic block types", () => {
        blockRegistry.registerBlockType("testBlock", { hardness: 0.5 });
        blockRegistry.clear();

        expect(blockRegistry.hasBlockType("testBlock")).toBe(false);
        for (const { type } of basicBlocks) {
            expect(blockRegistry.hasBlockType(type)).toBe(true);
        }
    });
});
