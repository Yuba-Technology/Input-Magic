import { traverse3DArray, generate3DArray } from "@/map/utils";

// Generate the expected call order
const size = 2;
const expectedCallOrder = Array.from({ length: size }, (_, x) =>
    Array.from({ length: size }, (_, y) =>
        Array.from({ length: size }, (_, z) => ({ x, y, z }))
    )
).flat(size);

describe("traverse3DArray", () => {
    it("should call the callback with the correct order", () => {
        // Define a mock callback
        const callback = jest.fn();

        // Create a 3D array of elements
        const arr = generate3DArray(
            { x: size, y: size, z: size },
            (pos) => pos // Actually in format { x, y, z }
        );

        // Call the function with the array and the mock callback
        traverse3DArray(arr, callback);

        // Check if the callback was called with the correct parameters
        for (const [index, expectedCall] of expectedCallOrder.entries()) {
            expect(callback).toHaveBeenNthCalledWith(
                index + 1,
                expectedCall,
                expectedCall
            );
        }
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
