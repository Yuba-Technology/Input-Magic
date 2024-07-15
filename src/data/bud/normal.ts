import { BudData, BudUpdater } from "@/data/bud/types";
import { Block } from "@/data/map/block";
import { bud } from "@/data/bud/bud";
import { getPlaneAdjacent, getPlaneAdjacentBlocks } from "@/data/bud/utils";

class Liquid {
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
        Liquid.flow(data);
    }
}

class NormalUpdate implements BudUpdater {
    private static context = bud;

    handleBud(data: BudData): void {
        Liquid.update(data);
    }
}

export { NormalUpdate, Liquid };
