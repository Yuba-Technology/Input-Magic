import {
    generate2DArray,
    generate3DArray,
    traverse2DArray,
    traverse3DArray
} from "@/map/utils";

// Generate the expected call order
const size2D = 1;
const expected2DCallOrder = Array.from({ length: size2D }, (_, x) =>
    Array.from({ length: size2D }, (_, y) => ({ x, y }))
).flat(size2D);

const size3D = 2;
const expected3DCallOrder = Array.from({ length: size3D }, (_, x) =>
    Array.from({ length: size3D }, (_, y) =>
        Array.from({ length: size3D }, (_, z) => ({ x, y, z }))
    )
).flat(size3D);

describe("traverse2DArray", () => {
    it("should call the callback with the correct order", () => {
        // Define a mock callback
        const callback = jest.fn();

        // Create a 2D array of elements
        const arr = generate2DArray(
            { x: size2D, y: size2D },
            (pos) => pos // Actually in format { x, y }
        );

        // Call the function with the array and the mock callback
        traverse2DArray(arr, callback);

        // Check if the callback was called with the correct parameters
        for (const [index, expectedCall] of expected2DCallOrder.entries()) {
            expect(callback).toHaveBeenNthCalledWith(
                index + 1,
                expectedCall,
                expectedCall
            );
        }
    });
});

describe("traverse3DArray", () => {
    it("should call the callback with the correct order", () => {
        // Define a mock callback
        const callback = jest.fn();

        // Create a 3D array of elements
        const arr = generate3DArray(
            { x: size3D, y: size3D, z: size3D },
            (pos) => pos // Actually in format { x, y, z }
        );

        // Call the function with the array and the mock callback
        traverse3DArray(arr, callback);

        // Check if the callback was called with the correct parameters
        for (const [index, expectedCall] of expected3DCallOrder.entries()) {
            expect(callback).toHaveBeenNthCalledWith(
                index + 1,
                expectedCall,
                expectedCall
            );
        }
    });
});

describe("generate2DArray", () => {
    it("should generate a 2D array with the correct size and elements", () => {
        const size = 2;
        const arr = generate2DArray(
            { x: size, y: size },
            (pos) => pos // Actually in format { x, y }
        );

        traverse2DArray(arr, (element, relativePos) => {
            const expectedElement = relativePos;
            expect(element).toEqual(expectedElement);
        });
    });
});

describe("generate3DArray", () => {
    it("should generate a 3D array with the correct size and elements", () => {
        const size = 2;
        const arr = generate3DArray(
            {
                x: size,
                y: size,
                z: size
            },
            (pos) => pos // Actually in format { x, y, z }
        );

        traverse3DArray(arr, (element, relativePos) => {
            const expectedElement = relativePos;
            expect(element).toEqual(expectedElement);
        });
    });
});
