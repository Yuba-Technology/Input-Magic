import Perlin from "@/map/generator/lib/perlin";

type PerlinNoiseConfig = {
    seed?: string;
    octaves?: number;
};

interface PerlinNoiseInterface {
    seed: string;
    octaves: number;
    perlin: Perlin;
    noise2d(x: number, y: number): number;
    map(
        value: number,
        inputMin: number,
        inputMax: number,
        outputMin: number,
        outputMax: number
    ): number;
}

class PerlinNoise implements PerlinNoiseInterface {
    seed: string;
    octaves: number;
    perlin: Perlin;

    constructor(config: PerlinNoiseConfig) {
        this.seed = config.seed || "random seed";
        this.octaves = config.octaves || 4;
        this.perlin = new Perlin(this.seed);

        this.noise2d = this.noise2d.bind(this);
    }

    noise2d(x: number, y: number): number {
        x /= 150;
        y /= 150;
        let value = 0;
        let frequency = 2 ** (this.octaves - 1);
        for (let i = 0; i < this.octaves; i++) {
            value += this.map(
                this.perlin.noise(x * frequency, y * frequency, 0),
                0,
                1,
                -1,
                1
            );
            frequency /= 2;
        }

        value = this.map(value, -this.octaves, this.octaves, 0, 1);
        return value;
    }

    map(
        value: number,
        inputMin: number,
        inputMax: number,
        outputMin: number,
        outputMax: number
    ): number {
        return (
            ((value - inputMin) * (outputMax - outputMin)) /
                (inputMax - inputMin) +
            outputMin
        );
    }
}

export { PerlinNoise, PerlinNoiseInterface, PerlinNoiseConfig };
