type BlockPos = {
    x: number;
    y: number;
    z: number;
};

interface BlockInterface {
    pos: BlockPos;
    type: string;
}

class Block implements BlockInterface {
    pos: BlockPos;
    type: string;

    constructor(pos: BlockPos, type: string) {
        this.pos = pos;
        this.type = type;
    }
}

export { Block, BlockInterface, BlockPos };
