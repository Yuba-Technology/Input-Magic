declare class Perlin {
    constructor(seed: number);
    noise(x: number, y: number, z: number): number;
}

export default Perlin;
