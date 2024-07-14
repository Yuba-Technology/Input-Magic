import { BudData, BudUpdater } from "@/bud/types";
import { Block } from "@/map/block";
import { bud } from "@/bud/bud";
import { getPlaneAdjacent, getPlaneAdjacentBlocks } from "@/bud/utils";

class Water {
    private static context = bud;

    static flow(data: BudData): void {
        const adjacentBlocks = getPlaneAdjacentBlocks(
            data.dimension,
            data.pos
        );

        const waterCount = adjacentBlocks.filter(
            (block) => block.type === "water"
        ).length;

        if (waterCount < 2) return;

        data.dimension.setBlock(data.pos, new Block("water"));
        const adjacentCoordinates = getPlaneAdjacent(data.pos);
        for (const pos of adjacentCoordinates) {
            if (data.dimension.getBlock(pos)?.type !== "air") continue;

            this.context.add({
                type: 0,
                pos,
                dimension: data.dimension,
                delay: 1
            });
        }
    }

    static update(data: BudData): void {
        Water.flow(data);
    }
}

class NormalUpdate implements BudUpdater {
    private static context = bud;

    handleBud(data: BudData): void {
        Water.update(data);
    }
}

export default NormalUpdate;