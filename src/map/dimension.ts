import { Chunk } from "@/map/chunk";

/**
 * The configuration for a dimension in the world.
 * @typedef {Object} DimensionConfig
 * @property {string} id - The ID of the dimension.
 * @property {Chunk[]} [chunks] - The chunks in the dimension.
 */
type DimensionConfig = {
    id: string;
    chunks?: { [key: string]: Chunk }; // The chunks in the dimension. Key is the chunk position in the format "x,y".
};

/**
 * The interface for a dimension in the world.
 * @interface DimensionInterface
 * @property {string} id - The ID of the dimension.
 * @property {Chunk[]} chunks - The chunks in the dimension.
 */
interface DimensionInterface {
    id: string; // The ID of the dimension.
    chunks: { [key: string]: Chunk }; // The chunks in the dimension. Key is the chunk position in the format "x,y".
}

/**
 * A dimension in the world.
 * @class
 * @implements {DimensionInterface}
 * @extends {DimensionConfig}
 */
class Dimension implements DimensionInterface {
    id: string; // The ID of the dimension.
    chunks: { [key: string]: Chunk }; // The chunks in the dimension. Key is the chunk position in the format "x,y".

    /**
     * @constructor
     * @param config - The configuration for the dimension.
     */
    constructor(config: DimensionConfig) {
        this.id = config.id;
        this.chunks = config.chunks || {};
    }
}

export { Dimension, DimensionInterface, DimensionConfig };
