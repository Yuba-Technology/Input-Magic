import { Chunk } from "@/chunk/chunk";

type DimentionPos = {
    id: number;
};

interface DimentionInterface {
    pos: DimentionPos;
    chunks: Chunk[];
}

class Dimention implements DimentionInterface {
    pos: DimentionPos;
    chunks: Chunk[];

    constructor(pos: DimentionPos) {
        this.pos = pos;
        this.chunks = [];
    }
}

export { Dimention, DimentionInterface, DimentionPos };
