import { Chunk } from "@/map/chunk";

/**
 * The configuration for a dimension in the world.
 * @typedef {Object} DimensionConfig
 * @property {string} id - The ID of the dimension.
 * @property {Chunk[]} [chunks] - The chunks in the dimension.
 */
type DimensionConfig = {
    id: string;
    chunks?: Chunk[];
};

/**
 * The interface for a dimension in the world.
 * @interface DimensionInterface
 * @property {string} id - The ID of the dimension.
 * @property {Chunk[]} chunks - The chunks in the dimension.
 */
interface DimensionInterface {
    id: string;
    chunks: Chunk[];
}

/**
 * A dimension in the world.
 * @class
 * @implements {DimensionInterface}
 * @extends {DimensionConfig}
 */
class Dimension implements DimensionInterface {
    id: string; // The ID of the dimension.
    chunks: Chunk[]; // The chunks in the dimension.

    /**
     * @constructor
     * @param config - The configuration for the dimension.
     */
    constructor(config: DimensionConfig) {
        this.id = config.id;
        this.chunks = config.chunks || [];
    }
}

export { Dimension, DimensionInterface, DimensionConfig };
