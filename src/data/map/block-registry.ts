import { BlockSharedProperties } from "@/data/map/block";
import { basicBlocks } from "@/config/basic-blocks";

class BlockRegistry {
    private static instance: BlockRegistry;
    private propertiesMap: { [blockType: string]: BlockSharedProperties } = {};

    static getInstance(): BlockRegistry {
        BlockRegistry.instance ||= new BlockRegistry();
        return BlockRegistry.instance;
    }

    /**
     * Register a block type with its shared properties.
     * @param blockType The type of the block.
     * @param sharedProperties The shared properties of the block.
     */
    registerBlockType<T extends BlockSharedProperties>(
        blockType: string,
        sharedProperties: T
    ): void {
        this.propertiesMap[blockType] = sharedProperties;
    }

    /**
     * Whether a block type is registered.
     * @param blockType The type of the block.
     */
    hasBlockType(blockType: string): boolean {
        return blockType in this.propertiesMap;
    }

    /**
     * Get the shared properties of a block type.
     * @param blockType The type of the block.
     * @returns The shared properties of the block.
     */
    getBlockTypeProperties<T extends BlockSharedProperties>(
        blockType: string
    ): T | undefined {
        return this.propertiesMap[blockType] as T | undefined;
    }

    clear(): void {
        this.propertiesMap = {};
        for (const { type, sharedProperties } of basicBlocks) {
            this.registerBlockType(type, sharedProperties);
        }
    }
}

const blockRegistry = BlockRegistry.getInstance();

for (const { type, sharedProperties } of basicBlocks) {
    blockRegistry.registerBlockType(type, sharedProperties);
}

export { blockRegistry };
