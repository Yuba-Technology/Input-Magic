import {
    Application,
    Graphics,
    Sprite,
    Container,
    ContainerChild,
    Texture,
    RenderTexture
} from "pixi.js";
import { BlockPos, Block, EmptyBlock } from "@/data/map/block";
import { Chunk } from "@/data/map/chunk";
import { Dimension } from "@/data/map/dimension";
import { Generator3D } from "@/data/map/generator/3d";
import { generate2DArray, traverse3DArray } from "@/data/map/utils";

/**
 * !IMPORTANT: The coordinate system used in rendering
 * !is quite different from the one used in the data model!
 * !Please be careful when converting between them.
 *
 * Here is the coordinate system used in rendering:
 *        ------------> x
 *       /|
 *      / |
 *     /  |
 *  z ↙   |
 *        ↓ y
 *
 * However, the coordinate system used in the data model is:
 *
 *      ↑ z
 *      |
 *      |
 *      |
 *      ------------> x
 *     /
 *    /
 *   /
 *  ↙ y
 *
 * And for screen coordinates, which is responsible for final visual rendering:
 *   -------------> x
 *   |
 *   |
 *   |
 *   |
 *   ↓ y
 *
 * The `data model` coordinate system, which is used in the data model, will be converted to the
 * `render` coordinate system, which is used in rendering calculations, and finally to the `screen`
 * coordinate system, which is the same as the computer screen coordinate system.
 *
 * When converting the block position in the data model to the render block position, the following
 * formula should be used:
 * renderBlockPos = { x: blockPos.x, y: renderChunkHeight - 1 - blockPos.z, z: blockPos.y }
 *
 * When converting the render block position to the block position in the data model, the following
 * formula should be used:
 * blockPos = { x: renderBlockPos.x, y: renderChunkHeight - 1 - renderBlockPos.z, z: renderBlockPos.y }
 *
 * @see {@link getRenderFactor} for the conversion between the render block position and the screen position.
 */

const blockSize = 30;
// const blockSize = 40;
const renderChunkHeight = Chunk.HEIGHT;
// const renderChunkSize = 1;
const renderChunkSize = 8;
const startPosition = { x: -150, y: -300 };
// const startPosition = { x: 0, y: -500 };

/**
 * The block position type used in rendering.
 * @note Notice that this type is different from the one used in the data model,
 * because different coordinate systems are used in rendering and data model.
 * However, this coordinate is not the same as the final render position.
 */
type RenderBlockPos = {
    x: number;
    z: number;
    y: number;
};

function getRenderFactor(pos: RenderBlockPos) {
    // Magic. Do not touch.
    return {
        x:
            blockSize * pos.x -
            Math.cos((5 / 12) * Math.PI) * blockSize * pos.z,
        y:
            (2 / 3) * blockSize * pos.y +
            Math.sin((5 / 12) * Math.PI) * blockSize * pos.z
    };
}

/**
 * Returns the texture points of the block
 * @param sideLength The length of the side of the block, in pixels (px)
 * @returns The texture points of the block
 */
const texturePoints = (sideLength: number) => [
    // the top face
    [
        sideLength * Math.cos((5 / 12) * Math.PI),
        -sideLength * Math.sin((5 / 12) * Math.PI),
        sideLength * Math.cos((5 / 12) * Math.PI) + sideLength,
        -sideLength * Math.sin((5 / 12) * Math.PI),
        sideLength,
        0,
        0,
        0
    ],
    // The block's front face
    [
        0,
        0,
        sideLength,
        0,
        sideLength,
        (sideLength * 2) / 3,
        0,
        (sideLength * 2) / 3
    ],
    // The right face
    [
        sideLength,
        0,
        sideLength + sideLength * Math.cos((5 / 12) * Math.PI),
        -sideLength * Math.sin((5 / 12) * Math.PI),
        sideLength + sideLength * Math.cos((5 / 12) * Math.PI),
        (sideLength * 2) / 3 - sideLength * Math.sin((5 / 12) * Math.PI),
        sideLength,
        (sideLength * 2) / 3
    ]
];
const colorMapper: { [key: string]: string } = {
    stone: "#808080",
    sand: "#f0e68c",
    water: "#0000ff",
    grass: "#00ff00",
    dirt: "#8b4513",
    snow: "#ffffff"
};

// const colors = [0xcc2900, 0x990000, 0xff3300];

const colorVariants = (color: string): string[] => {
    if (!/^#[\dA-Fa-f]{6}$/.test(color)) {
        throw new Error("Invalid hex color format");
    }

    // 将16进制颜色转换为RGB
    const r = Number.parseInt(color.slice(1, 3), 16);
    const g = Number.parseInt(color.slice(3, 5), 16);
    const b = Number.parseInt(color.slice(5, 7), 16);

    // 生成变化的颜色
    const variants = [color];
    for (let i = 1; i <= 2; i++) {
        const newR = Math.max(0, r - 30 * (i + 1))
            .toString(16)
            .padStart(2, "0");
        const newG = Math.max(0, g - 30 * (i + 1))
            .toString(16)
            .padStart(2, "0");
        const newB = Math.max(0, b - 30 * (i + 1))
            .toString(16)
            .padStart(2, "0");
        variants.push(`#${newR}${newG}${newB}`);
    }

    return variants;
};

const renderChunkPixiWidth =
    getRenderFactor({ x: 1, y: 0, z: 0 }).x * (renderChunkSize + 1);
const renderChunkPixiHeight =
    getRenderFactor({ x: 0, y: 0, z: 1 }).y * (renderChunkSize + 1);
const xMaxChunkLength =
    Math.ceil(window.innerWidth / renderChunkPixiWidth) + 5;
const yMaxChunkLength =
    Math.ceil(window.innerHeight / renderChunkPixiHeight) + 5;

class Render {
    private static instance: Render;
    app: Application;
    private textures: { [key: string]: Texture } = {};
    /**
     * The render grid, which stores the render chunks, in format [y][x].
     * The x-axis is the horizontal axis, and the y-axis is the vertical axis.
     * Notice that the x-axis is reversed to the screen coordinate system,
     * because it was sorted by z-index, which is reversed to the screen x-axis.
     */
    rengerGrid: Container[][] = [];
    private currentXOffset: number = 0;
    private currentYOffset: number = 0;

    constructor() {
        this.app = new Application({
            antialias: true,
            resolution: window.devicePixelRatio,
            autoDensity: true
        });
        // @ts-expect-error No error!!!!!!!!!
        globalThis.__PIXI_APP__ = this.app;
    }

    private async init() {
        await this.app.init({ background: "#1099bb", resizeTo: window });
        document.body.append(this.app.canvas);
    }

    static async getInstance() {
        if (!Render.instance) {
            Render.instance = new Render();
            await Render.instance.init();
        }

        return Render.instance;
    }

    private createGraphics(color: string, sideLength: number = blockSize) {
        const graphics = new Graphics();
        const points = texturePoints(sideLength);
        const colors = colorVariants(color);
        for (const [i, point] of points.entries()) {
            graphics.beginFill(colors[i]);
            graphics.lineStyle(2, 0x3f3f3f, 1);
            graphics.drawPolygon(point);
            graphics.endFill();
        }

        return graphics;
    }

    private getTexture(color: string) {
        this.textures[color] ||= this.app.renderer.generateTexture(
            this.createGraphics(color)
        );

        return this.textures[color];
    }

    convertBlockPosToRenderBlockPos(blockPos: BlockPos): RenderBlockPos {
        return {
            x: blockPos.x,
            y: renderChunkHeight - 1 - blockPos.z,
            z: blockPos.y
        };
    }

    convertRenderBlockPosToBlockPos(renderBlockPos: RenderBlockPos): BlockPos {
        return {
            x: renderBlockPos.x,
            y: renderChunkHeight - 1 - renderBlockPos.z,
            z: renderBlockPos.y
        };
    }

    private renderBlock(
        color: string,
        pos: RenderBlockPos,
        container: Container<ContainerChild>
    ) {
        const sprite = new Sprite(this.getTexture(color));
        const { x, y } = getRenderFactor(pos);
        sprite.x = startPosition.x + x;
        sprite.y = startPosition.y + y;
        sprite.zIndex = (pos.x + pos.z) * 100000 - pos.y * 10;
        container.addChild(sprite);
    }

    renderRChunk(blockArray: Block[][][], stagePos: { x: number; y: number }) {
        const container = new Container();
        traverse3DArray(blockArray, (value: Block, pos: BlockPos) => {
            if (value instanceof EmptyBlock) return;

            /**
             * The block on the right
             * ■ □ <- righter block
             * ↑ current block
             */
            const noRighterBlock =
                pos.x + 1 >= renderChunkSize ||
                blockArray[pos.x + 1][pos.y][pos.z] instanceof EmptyBlock;

            const noLeftBlock =
                pos.x - 1 < 0 ||
                blockArray[pos.x - 1][pos.y][pos.z] instanceof EmptyBlock;

            const noBackBlock =
                pos.y - 1 < 0 ||
                blockArray[pos.x][pos.y - 1][pos.z] instanceof EmptyBlock;

            /**
             * The block in front
             * ■ <- front block
             * ↑ current block (behind the front block)
             */
            const noFrontBlock =
                pos.y + 1 >= renderChunkSize ||
                blockArray[pos.x][pos.y + 1][pos.z] instanceof EmptyBlock;
            /**
             * The block above
             * □ <- upper block
             * ■ <- current block
             */
            const noUpperBlock =
                pos.z + 1 >= renderChunkHeight ||
                blockArray[pos.x][pos.y][pos.z + 1] instanceof EmptyBlock;

            // if (
            //     !noBackBlock &&
            //     !noRighterBlock &&
            //     !noFrontBlock &&
            //     !noLeftBlock &&
            //     !noUpperBlock
            // ) {
            //     return;
            // }

            // if (!noRighterBlock && !noFrontBlock && !noUpperBlock) {
            //     return;
            // }

            /**
             * 2 blocks above
             * □ <- upper and upper block
             * □
             * ■ <- current block
             */
            const noUpperAndUpperBlock =
                pos.z + 2 >= renderChunkHeight ||
                blockArray[pos.x][pos.y][pos.z + 2] instanceof EmptyBlock;
            /**
             * The block above the fronter block
             * □ <- upper and front block
             * ■ <- The front block, which is in front of the current block
             */
            const noUpperAndFrontBlock =
                pos.z + 1 >= renderChunkHeight ||
                pos.y + 1 >= renderChunkSize ||
                blockArray[pos.x][pos.y + 1][pos.z + 1] instanceof EmptyBlock;
            /**
             * The block above the righter block
             *   □ <- upper and righter block
             * ■ □ <- The righter block
             * ↑ current block
             */
            const noUpperAndRighterBlock =
                pos.z + 1 >= renderChunkHeight ||
                pos.x + 1 >= renderChunkSize ||
                blockArray[pos.x + 1][pos.y][pos.z + 1] instanceof EmptyBlock;

            // if (
            //     !noFrontBlock &&
            //     !noRighterBlock &&
            //     noUpperBlock &&
            //     !noUpperAndUpperBlock &&
            //     !noUpperAndFrontBlock &&
            //     !noUpperAndRighterBlock
            // )
            //     return;

            // if (upperBlock && righterBlock && frontBlock) return;
            // if (!(righterBlock || frontBlock)) return;
            const color =
                value.type in colorMapper
                    ? colorMapper[value.type]
                    : "#000000";
            pos = this.convertBlockPosToRenderBlockPos(pos);
            this.renderBlock(color, pos, container);
        });

        container.x = stagePos.x;
        container.y = stagePos.y;

        return container;
    }

    initStage() {
        // for (let i = 0; i < yMaxChunkLength; i++) {
        //     this.addBottomRow();
        // }
        // const containers = generate2DArray({ x: 5, y: 1 }, (pos) => {

        for (let y = 0; y < yMaxChunkLength; y++) {
            const row: Container[] = [];
            for (let x = 0; x < xMaxChunkLength; x++) {
                const array = dimension.getBlockArray(
                    {
                        x: x * 8,
                        y: y * 8,
                        z: 0
                    },
                    {
                        x: x * 8 + 8,
                        y: y * 8 + 8,
                        z: 15
                    }
                );
                const container = this.renderRChunk(array, {
                    x:
                        getRenderFactor({ x, y: 0, z: y }).x *
                        (renderChunkSize + 1),
                    y:
                        getRenderFactor({ x, y: 0, z: y }).y *
                        (renderChunkSize + 1)
                });
                this.app.stage.addChild(container);
                row.push(container);
            }

            this.rengerGrid.push(row);
        }

    }

    addTopRow() {
        const row: Container[] = [];
        // eslint-disable-next-line unicorn/no-array-for-each
        this.rengerGrid.pop()?.forEach((container) => {
            container.destroy();
        });

        const yStart = this.rengerGrid[0][0].y - renderChunkPixiHeight;
        this.currentYOffset--;

        for (let x = 0; x < xMaxChunkLength; x++) {
            const array = dimension.getBlockArray(
                {
                    x: x * 8,
                    y: 0,
                    z: 0
                },
                {
                    x: x * 8 + 8,
                    y: 8,
                    z: 15
                }
            );
            const container = this.renderRChunk(array, {
                x:
                    getRenderFactor({
                        x: x + this.currentXOffset,
                        // x: x - 1,
                        y: 0,
                        z: this.currentYOffset
                    }).x *
                    (renderChunkSize + 1),
                y: yStart
                // x: x * rendeerChunkWidth,
                // y: yMaxChunkLength * rendeerChunkHeight
            });
            row.push(container);
        }

        this.rengerGrid.unshift(row);
        // this.app.stage.addChild(...row);
        for (const container of [...row].reverse()) {
            this.app.stage.addChildAt(container, 0);
        }

    }

    addRightColumn() {
        this.currentXOffset++;

        for (let y = 0; y < yMaxChunkLength; y++) {
            const xStart =
                this.rengerGrid[y][this.rengerGrid[y].length - 1].x +
                renderChunkPixiWidth;
            this.rengerGrid[y].shift()?.destroy();

            const array = dimension.getBlockArray(
                {
                    x: xMaxChunkLength * 8,
                    y: y * 8,
                    z: 0
                },
                {
                    x: xMaxChunkLength * 8 + 8,
                    y: y * 8 + 8,
                    z: 15
                }
            );
            const container = this.renderRChunk(array, {
                x: xStart,
                y:
                    getRenderFactor({
                        x: xMaxChunkLength,
                        y: 0,
                        z: y + this.currentYOffset
                    }).y *
                    (renderChunkSize + 1)
            });

            this.rengerGrid[y].push(container);
            this.app.stage.addChildAt(
                container,
                (y + 1) * xMaxChunkLength - 1
            );
        }
    }

    // 向最下方添加一排区块
    addBottomRow() {
        const row: Container[] = [];
        // eslint-disable-next-line unicorn/no-array-for-each
        this.rengerGrid.shift()?.forEach((container) => {
            container.destroy();
        });
        // const topRow = this.rengerGrid.shift();
        // if (topRow) {
        //     for (const renderChunk of topRow) {
        //         renderChunk?.destroy();
        //     }
        // }
        const yStart =
            this.rengerGrid[this.rengerGrid.length - 1][0].y +
            renderChunkPixiHeight;
        this.currentYOffset++;

        for (let x = 0; x < xMaxChunkLength; x++) {
            const array = dimension.getBlockArray(
                {
                    x: x * 8,
                    y: 0,
                    z: 0
                },
                {
                    x: x * 8 + 8,
                    y: 8,
                    z: 15
                }
            );
            const container = this.renderRChunk(array, {
                x:
                    getRenderFactor({
                        x: x + this.currentXOffset,
                        y: 0,
                        z: yMaxChunkLength - 1 + this.currentYOffset
                    }).x *
                    (renderChunkSize + 1),
                y: yStart
                // x: x * rendeerChunkWidth,
                // y: yMaxChunkLength * rendeerChunkHeight
            });
            row.push(container);
        }

        this.rengerGrid.push(row);
        this.app.stage.addChild(...row);
    }

    addLeftColumn() {
        this.currentXOffset--;

        // console.log(this.currentXOffset, this.currentYOffset);

        // console.log("Before:");
        // console.table(
        //     this.rengerGrid.map((row) =>
        //         row.map((chunk) => [chunk.x, chunk.y])
        //     )
        // );

        for (let y = 0; y < yMaxChunkLength; y++) {
            const xStart = this.rengerGrid[y][0].x - renderChunkPixiWidth;
            // console.log("xStart:", this.rengerGrid[y][0].x);
            this.rengerGrid[y].pop()?.destroy();

            const array = dimension.getBlockArray(
                {
                    x: -8,
                    y: y * 8,
                    z: 0
                },
                {
                    x: 0,
                    y: y * 8 + 8,
                    z: 15
                }
            );
            const container = this.renderRChunk(array, {
                x: xStart,
                y:
                    getRenderFactor({
                        x: xMaxChunkLength,
                        // y: this.currentYOffset,
                        y: 0,
                        // z: this.currentXOffset + y
                        z: y + this.currentYOffset
                    }).y *
                    (renderChunkSize + 1)
            });

            this.rengerGrid[y].unshift(container);
            this.app.stage.addChildAt(container, y * xMaxChunkLength);
        }

    }

    // 是否将要超出屏幕
    willOutOfScreen() {
        const result = [];
        const leftContainer = this.rengerGrid[0][0];
        // console.log("Left:", this.app.stage.x + leftContainer.x);
        if (this.app.stage.x + leftContainer.x > -renderChunkPixiWidth / 2)
            result.push("left");
        const rightContainer =
            this.rengerGrid[this.rengerGrid.length - 1][
                this.rengerGrid[0].length - 1
            ];
        // console.table(
        //     this.rengerGrid.map((row) =>
        //         row.map((chunk) => [chunk.x, chunk.y])
        //     )
        // );
        // Simplified from the following formula:
        // if (
        //     window.innerWidth -
        //         (this.app.stage.x + rightContainer.x) -
        //         renderChunkPixiWidth >
        //     -renderChunkPixiWidth / 2
        // )
        // console.log(rightContainer.x);
        // console.log(
        //     "Right:",
        //     window.innerWidth -
        //         (this.app.stage.x + rightContainer.x) -
        //         renderChunkPixiWidth
        // );
        if (
            this.app.stage.x + rightContainer.x <
            window.innerWidth - renderChunkPixiWidth / 2
        )
            result.push("right");
        const topContainer = this.rengerGrid[0][0];
        // if (topContainer.y > -renderChunkPixiHeight) result.push("top");
        if (this.app.stage.y + topContainer.y > -renderChunkPixiHeight / 2)
            result.push("top");
        const bottomContainer = this.rengerGrid[this.rengerGrid.length - 1][0];
        if (
            this.app.stage.y + bottomContainer.y <
            window.innerHeight - renderChunkPixiHeight / 2
        )
            result.push("bottom");
        // if (bottomContainer.y < window.innerHeight + renderChunkPixiHeight)
        //     result.push("bottom");        return result;
    }
}

const render = await Render.getInstance();

export { render };
