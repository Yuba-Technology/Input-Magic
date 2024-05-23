import { Block } from "@/block/block";
import { Entity } from "@/entity/entity";

/**
 * The position of a chunk in the world.
 * @typedef {Object} ChunkPos
 * @property {number} x - The x-coordinate of the chunk.
 * @property {number} y - The y-coordinate of the chunk.
 */
type ChunkPos = {
    x: number;
    y: number;
};

/**
 * The configuration for a chunk in the world.
 * @typedef {Object} ChunkConfig
 * @property {ChunkPos} pos - The position of the chunk.
 * @property {Block[]} [blocks] - The blocks in the chunk.
 * @property {Entity[]} [entities] - The entities in the chunk.
 */
type ChunkConfig = {
    pos: ChunkPos;
    blocks?: Block[];
    entities?: Entity[];
};

/**
 * The interface for a chunk in the world.
 * @interface ChunkInterface
 * @property {ChunkPos} pos - The position of the chunk.
 * @property {Block[]} blocks - The blocks in the chunk.
 * @property {Entity[]} entities - The entities in the chunk.
 * @extends {ChunkConfig}
 */
interface ChunkInterface {
    pos: ChunkPos;
    blocks: Block[];
    entities: Entity[];
}

/**
 * A chunk in the world.
 * @class
 * @implements {ChunkInterface}
 * @extends {ChunkConfig}
 */
class Chunk implements ChunkInterface {
    pos: ChunkPos;
    blocks: Block[];
    entities: Entity[];

    /**
     * @constructor
     * @param config - The configuration for the chunk.
     */
    constructor(config: ChunkConfig) {
        this.pos = config.pos;
        this.blocks = config.blocks || [];
        this.entities = config.entities || [];
    }
}

export { Chunk, ChunkInterface, ChunkPos, ChunkConfig };
