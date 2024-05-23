import { Chunk } from "@/chunk/chunk";

type DimensionConfig = {
    id: string;
    chunks?: Chunk[];
};

interface DimensionInterface {
    id: string;
    chunks: Chunk[];
}

class Dimension implements DimensionInterface {
    id: string;
    chunks: Chunk[];

    constructor(config: DimensionConfig) {
        this.id = config.id;
        this.chunks = config.chunks || [];
    }
}

export { Dimension, DimensionInterface, DimensionConfig };
