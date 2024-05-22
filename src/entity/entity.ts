type EntityPos = {
    x: number;
    y: number;
    z: number;
};

interface EntityInterface {
    pos: EntityPos;
}

class Entity implements EntityInterface {
    pos: EntityPos;

    constructor(pos: EntityPos) {
        this.pos = pos;
    }
}

export { Entity, EntityInterface, EntityPos };
