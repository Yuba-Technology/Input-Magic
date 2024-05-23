import { Block } from "@/map/block";
import { traverseBlockArray, generateBlockArray } from "@/map/utils";

// // Generate a 3D array of blocks
// function generateBlockArray(size: number): Block[][][] {
//     return Array.from({ length: size }, (_, x) =>
//         Array.from({ length: size }, (_, y) =>
//             Array.from({ length: size }, (_, z) => ({
//                 type: "stone",
//                 pos: { x, y, z }
//             }))
//         )
//     );
// }

// Generate the expected call order
const size = 2;
const expectedCallOrder = Array.from({ length: size }, (_, x) =>
    Array.from({ length: size }, (_, y) =>
        Array.from({ length: size }, (_, z) => ({
            block: { type: "stone", pos: { x, y, z } },
            relativePos: { x, y, z }
        }))
    )
).flat(size);

describe("traverseBlockArray", () => {
    it("should call the callback with the correct parameters", () => {
        // Define a mock callback
        const callback = jest.fn();

        // Create a 3D array of blocks
        const arr: Block[][][] = generateBlockArray(
            { x: size, y: size, z: size },
            ({ x, y, z }) => ({
                type: "stone",
                pos: { x, y, z }
            })
        );

        // Call the function with the array and the mock callback
        traverseBlockArray(arr, callback);

        // Check if the callback was called with the correct parameters
        for (const [index, expectedCall] of expectedCallOrder.entries()) {
            expect(callback).toHaveBeenNthCalledWith(
                index + 1,
                expectedCall.block,
                expectedCall.relativePos
            );
        }
    });
});

describe("generateBlockArray", () => {
    it("should generate a 3D block array with the correct size and blocks", () => {
        const size = 2;
        const arr = generateBlockArray(
            {
                x: size,
                y: size,
                z: size
            },
            ({ x, y, z }) => ({
                type: "stone",
                pos: { x, y, z }
            })
        );

        traverseBlockArray(arr, (block, relativePos) => {
            const expectedBlock = {
                type: "stone",
                pos: relativePos
            };

            expect(block).toEqual(expectedBlock);
        });
    });
});
