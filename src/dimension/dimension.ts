import { Chunk } from "@/chunk/chunk";

type DimensionPos = {
    id: number;
};

interface DimensionInterface {
    pos: DimensionPos;
    chunks: Chunk[];
}

class Dimension implements DimensionInterface {
    pos: DimensionPos;
    chunks: Chunk[];

    constructor(pos: DimensionPos) {
        this.pos = pos;
        this.chunks = [];
    }
}

export { Dimension, DimensionInterface, DimensionPos };
