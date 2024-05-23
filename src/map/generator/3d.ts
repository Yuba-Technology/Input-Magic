import { Block, BlockPos } from "@/map/block";
import { Chunk, ChunkPos } from "@/map/chunk";

class MapGenerator {
    seed: string;

    constructor(seed: string) {
        this.seed = seed;
    }

    generateBlock(pos: BlockPos) {
        return new Block(pos, "stone");
    }

    generateChunk(pos: ChunkPos) {
        const blocks = Array.from({ length: Chunk.SIZE }, () =>
            Array.from({ length: Chunk.SIZE }, () =>
                Array.from({ length: Chunk.HEIGHT }, () =>
                    this.generateBlock({ x: 0, y: 0, z: 0 })
                )
            )
        );

        return new Chunk({ pos, blocks });
    }
}

export { MapGenerator };
