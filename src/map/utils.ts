import { Block } from "@/map/block";

/**
 * Traverses a 3D block array and calls a callback function for each element.
 * The order of traversal is z-axis first, then y-axis, and finally x-axis.
 * @param arr The 3D block array to be traversed.
 * @param callback The callback function to be called for each element.
 * @returns {void}
 * @example
 * [
 *     [
 *         [block1, block2],
 *         [block3, block4]
 *     ],
 *     [
 *        [block5, block6],
 *        [block7, block8]
 *     ]
 * ]
 * // The order of traversal is block1, block2, block3, block4, block5, block6, block7, block8.
 */
export function traverseBlockArray(
    arr: Block[][][],
    callback: (
        block: Block,
        relativePos: { x: number; y: number; z: number } // The relative position of the block in the array.
    ) => void
) {
    for (const [x, xLayer] of arr.entries()) {
        for (const [y, yLayer] of xLayer.entries()) {
            for (const [z, block] of yLayer.entries()) {
                callback(block, { x, y, z });
            }
        }
    }
}

/**
 * Generates a 3D block array with the given size and calls a generator function for each block.
 * @param size The size of the 3D block array.
 * @param callback The generator function to be called for each block.
 * @returns {Block[][][]} The 3D block array.
 * @example
 * generateBlockArray({ x: 2, y: 2, z: 2 }, ({ x, y, z }) => ({
 *    type: "stone",
 *    pos: { x, y, z }
 * }));
 * // The generated 3D block array:
 * // [
 * //     [
 * //         [
 * //             { type: "stone", pos: { x: 0, y: 0, z: 0 } },
 * //             { type: "stone", pos: { x: 0, y: 0, z: 1 } }
 * //         ],
 * //         [
 * //             { type: "stone", pos: { x: 0, y: 1, z: 0 } },
 * //             { type: "stone", pos: { x: 0, y: 1, z: 1 } }
 * //         ]
 * //     ],
 * //     [
 * //         [
 * //             { type: "stone", pos: { x: 1, y: 0, z: 0 } },
 * //             { type: "stone", pos: { x: 1, y: 0, z: 1 } }
 * //         ],
 * //         [
 * //             { type: "stone", pos: { x: 1, y: 1, z: 0 } },
 * //             { type: "stone", pos: { x: 1, y: 1, z: 1 } }
 * //         ]
 * //     ]
 * // ]
 */
export function generateBlockArray(
    size: { x: number; y: number; z: number },
    callback: (
        relativePos: { x: number; y: number; z: number } // The relative position of the block in the array.
    ) => Block
): Block[][][] {
    return Array.from({ length: size.x }, (_, x) =>
        Array.from({ length: size.y }, (_, y) =>
            Array.from({ length: size.z }, (_, z) => callback({ x, y, z }))
        )
    );
}
