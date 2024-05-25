import seedrandom from "seedrandom";
let seedUser: number = 0;
type perlinParameter = {
    chunkLength: number;
    count: number;
    baseHeight: number;
    rangeHeight: number;
    seed: number;
    step: number;
    areaLength: number;
};
interface perlinGeneratorInterface {
    chunkLength: number;
    count: number;
    baseHeight: number;
    rangeHeight: number;
    seed: number;
    step: number;
    areaLength: number;
    perlin_map_linear(configPerlin: perlinParameter): number[][] | null;
    perlin_map_cos(configPerlin: perlinParameter): number[][] | null;
    perlin_map_tree(configPerlin: perlinParameter): number[][] | null;
}
class perlinGenerator implements perlinGeneratorInterface {
    chunkLength: number;
    count: number;
    baseHeight: number;
    rangeHeight: number;
    seed: number;
    step: number;
    areaLength: number;
    constructor(configPerlin: perlinParameter) {
        this.chunkLength = configPerlin.chunkLength;
        this.count = configPerlin.count;
        this.baseHeight = configPerlin.baseHeight;
        this.rangeHeight = configPerlin.rangeHeight;
        this.seed = configPerlin.seed;
        this.step = this.chunkLength - 1;
        this.areaLength = this.step * this.count + 1;
    }
    perlin_map_linear(): number[][] | null {
        let area: number[][] = Array.from(
            { length: this.areaLength },
            (_, x) => {
                Array.from({ length: this.areaLength }, (_, y) => 0);
            }
        );
        if (!area) {
            return null;
        } else {
            let iter_x: number = 0;
            let iter_y: number = 0;
            const rg = seedrandom(this.seed);
            while (iter_x <= this.step * this.count) {
                iter_y = 0;
                while (iter_y <= this.step * this.count) {
                    const randomFac: number = rg();
                    let perlin_out: number = Math.floor(
                        this.baseHeight + randomFac * this.rangeHeight
                    );
                    area[iter_x][iter_y] = perlin_out;
                    iter_y += this.step;
                }
            }
            for (let i: number = 0; i < this.areaLength; i++) {
                for (let j: number = 0; j < this.areaLength; i++) {
                    if (area[i][j] != 0) {
                        continue;
                    }
                    let chunk_x: number = Math.floor(i / this.step);
                    let chunk_y: number = Math.floor(j / this.step);
                    if (chunk_x < this.count && chunk_y) {
                        let rela_x: number = i - chunk_x * this.step;
                        let rela_y: number = j - chunk_y * this.step;
                        let fac_x: number = rela_x / this.chunkLength;
                        let fac_y: number = rela_y / this.chunkLength;
                        let border_leftdown: [number, number] = [
                            chunk_x * this.step,
                            chunk_y * this.step
                        ];
                        let border_rightdown: [number, number] = [
                            (chunk_x + 1) * this.step,
                            chunk_y * this.step
                        ];
                        let border_leftup: [number, number] = [
                            chunk_x * this.step,
                            (chunk_y + 1) * this.step
                        ];
                        let border_rightup: [number, number] = [
                            (chunk_x + 1) * this.step,
                            (chunk_y + 1) * this.step
                        ];
                        let val1: number =
                            (1 - fac_x) *
                                area[border_leftdown[0]][border_leftdown[1]] +
                            fac_x *
                                area[border_rightdown[0]][border_rightdown[1]];
                        let val2: number =
                            (1 - fac_x) *
                                area[border_leftup[0]][border_leftup[1]] +
                            fac_x * area[border_rightup[0]][border_rightup[1]];
                        let val_final = (1 - fac_y) * val1 + fac_y * val2;
                        area[i][j] = Math.floor(val_final);
                    }
                }
            }
        }

        return area || null;
    }
    perlin_map_cos(): number[][] | null {
        let area: number[][] = Array.from(
            { length: this.areaLength },
            (_, x) => {
                Array.from({ length: this.areaLength }, (_, y) => 0);
            }
        );
        if (!area) {
            return null;
        } else {
            let iter_x: number = 0;
            let iter_y: number = 0;
            const rg = seedrandom(this.seed);
            while (iter_x <= this.step * this.count) {
                iter_y = 0;
                while (iter_y <= this.step * this.count) {
                    const randomFac: number = rg();
                    let perlin_out: number = Math.floor(
                        this.baseHeight + randomFac * this.rangeHeight
                    );
                    area[iter_x][iter_y] = perlin_out;
                    iter_y += this.step;
                }
            }
            for (let i: number = 0; i < this.areaLength; i++) {
                for (let j: number = 0; j < this.areaLength; i++) {
                    if (area[i][j] != 0) {
                        continue;
                    }
                    let chunk_x: number = Math.floor(i / this.step);
                    let chunk_y: number = Math.floor(j / this.step);
                    if (chunk_x < this.count && chunk_y) {
                        let rela_x: number = i - chunk_x * this.step;
                        let rela_y: number = j - chunk_y * this.step;
                        let fac_x: number =
                            (1 -
                                Math.cos(
                                    (rela_x / this.chunkLength) * Math.PI
                                )) /
                            2;
                        let fac_y: number =
                            (1 -
                                Math.cos(
                                    (rela_y / this.chunkLength) * Math.PI
                                )) /
                            2;
                        let border_leftdown: [number, number] = [
                            chunk_x * this.step,
                            chunk_y * this.step
                        ];
                        let border_rightdown: [number, number] = [
                            (chunk_x + 1) * this.step,
                            chunk_y * this.step
                        ];
                        let border_leftup: [number, number] = [
                            chunk_x * this.step,
                            (chunk_y + 1) * this.step
                        ];
                        let border_rightup: [number, number] = [
                            (chunk_x + 1) * this.step,
                            (chunk_y + 1) * this.step
                        ];
                        let val1: number =
                            (1 - fac_x) *
                                area[border_leftdown[0]][border_leftdown[1]] +
                            fac_x *
                                area[border_rightdown[0]][border_rightdown[1]];
                        let val2: number =
                            (1 - fac_x) *
                                area[border_leftup[0]][border_leftup[1]] +
                            fac_x * area[border_rightup[0]][border_rightup[1]];
                        let val_final = (1 - fac_y) * val1 + fac_y * val2;
                        area[i][j] = Math.floor(val_final);
                    }
                }
            }
        }
        return area || null;
    }
}
