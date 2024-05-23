import { Block } from "@/block/block";
import { Entity } from "@/entity/entity";

type ChunkPos = {
    x: number;
    y: number;
};

type ChunkConfig = {
    pos: ChunkPos;
    blocks?: Block[];
    entities?: Entity[];
};

interface ChunkInterface {
    pos: ChunkPos;
    blocks: Block[];
    entities: Entity[];
}

class Chunk implements ChunkInterface {
    pos: ChunkPos;
    blocks: Block[];
    entities: Entity[];

    constructor(config: ChunkConfig) {
        this.pos = config.pos;
        this.blocks = config.blocks || [];
        this.entities = config.entities || [];
    }
}

export { Chunk, ChunkInterface, ChunkPos, ChunkConfig };
