import { Block } from "@/block/block";
import { Entity } from "@/entity/entity";

type ChunkPos = {
    x: number;
    y: number;
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

    constructor(pos: ChunkPos) {
        this.pos = pos;
        this.blocks = [];
        this.entities = [];
    }
}

export { Chunk, ChunkInterface, ChunkPos };
