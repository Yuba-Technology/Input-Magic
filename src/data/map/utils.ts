/* ----------------------------------------------- *\
 *                  Math utilities                 *
\* ----------------------------------------------- */

/**
 * Calculates the Chebyshev distance between two points.
 * @param pos1 The first point.
 * @param pos2 The second point.
 * @returns {number} The Chebyshev distance.
 * @example
 * chebyshevDistance({ x: 0, y: 0 }, { x: 1, y: 1 }); // 1
 * chebyshevDistance({ x: 0, y: 0 }, { x: 2, y: 3 }); // 3
 * chebyshevDistance({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 3 }); // 3
 */
export function chebyshevDistance(
    pos1: { x: number; y: number; z?: number },
    pos2: { x: number; y: number; z?: number }
): number {
    const z =
        pos1.z !== undefined && pos2.z !== undefined
            ? Math.abs(pos1.z - pos2.z)
            : 0;
    return Math.max(Math.abs(pos1.x - pos2.x), Math.abs(pos1.y - pos2.y), z);
}

/**
 * Calculates the Manhattan distance between two points.
 * @param pos1 The first point.
 * @param pos2 The second point.
 * @returns {number} The Manhattan distance.
 */
export function manhattanDistance(
    pos1: { x: number; y: number; z?: number },
    pos2: { x: number; y: number; z?: number }
): number {
    const z =
        pos1.z !== undefined && pos2.z !== undefined
            ? Math.abs(pos1.z - pos2.z)
            : 0;
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) + z;
}

/**
 * Calculates the Euclidean distance between two points.
 * @param pos1 The first point.
 * @param pos2 The second point.
 * @returns {number} The Euclidean distance.
 * @example
 * euclideanDistance({ x: 0, y: 0 }, { x: 1, y: 1 }); // 1.4142135623730951
 * euclideanDistance({ x: 0, y: 0 }, { x: 2, y: 3 }); // 3.605551275463989
 * euclideanDistance({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 3 }); // 3.7416573867739413
 */
export function euclideanDistance(
    pos1: { x: number; y: number; z?: number },
    pos2: { x: number; y: number; z?: number }
): number {
    const z =
        pos1.z !== undefined && pos2.z !== undefined
            ? (pos1.z - pos2.z) ** 2
            : 0;
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + z);
}

/* ----------------------------------------------- *\
 *                 Array utilities                 *
\* ----------------------------------------------- */

/**
 * Traverses a 2D array and calls a callback function for each element.
 * The order of traversal is y-axis first, and then x-axis.
 * @param arr The 2D array to be traversed.
 * @param callback The callback function to be called for each element.
 * @returns {void}
 * @example
 * const arr = [
 *     [element1, element2],
 *     [element3, element4]
 * ];
 *
 * traverse2DArray(arr, (element, relativePos) => console.log(element));
 * // element1, element2, element3, element4.
 */
export function traverse2DArray<T>(
    arr: T[][],
    callback: (
        element: T,
        relativePos: { x: number; y: number } // The relative position of the element in the array.
    ) => void
) {
    for (const [x, xLayer] of arr.entries()) {
        for (const [y, element] of xLayer.entries()) {
            callback(element, { x, y });
        }
    }
}

/**
 * Traverses a 3D array and calls a callback function for each element.
 * The order of traversal is z-axis first, then y-axis, and finally x-axis.
 * @param arr The 3D array to be traversed.
 * @param callback The callback function to be called for each element.
 * @returns {void}
 * @example
 * const arr = [
 *     [
 *         [element1, element2],
 *         [element3, element4]
 *     ],
 *     [
 *         [element5, element6],
 *         [element7, element8]
 *     ]
 * ];
 *
 * traverse3DArray(arr, (element, relativePos) => console.log(element));
 * // element1, element2, element3, element4, element5, element6, element7, element8.
 */
export function traverse3DArray<T>(
    arr: T[][][],
    callback: (
        element: T,
        relativePos: { x: number; y: number; z: number } // The relative position of the element in the array.
    ) => void
) {
    for (const [x, xLayer] of arr.entries()) {
        for (const [y, yLayer] of xLayer.entries()) {
            for (const [z, element] of yLayer.entries()) {
                callback(element, { x, y, z });
            }
        }
    }
}

/**
 * Generates a 2D array with the given size and calls a generator function for each element.
 * @param size The size of the 2D array.
 * @param callback The generator function to be called for each element.
 * @returns {T[][]} The 2D array.
 * @example
 * generate2DArray({ x: 2, y: 2 }, (pos) => pos);
 * // The generated 2D array:
 * // [
 * //     [
 * //         { x: 0, y: 0 },
 * //         { x: 0, y: 1 }
 * //     ],
 * //     [
 * //         { x: 1, y: 0 },
 * //         { x: 1, y: 1 }
 * //     ]
 * // ]
 */
export function generate2DArray<T>(
    size: { x: number; y: number },
    callback: (
        relativePos: { x: number; y: number } // The relative position of the element in the array.
    ) => T
): T[][] {
    return Array.from({ length: size.x }, (_, x) =>
        Array.from({ length: size.y }, (_, y) => callback({ x, y }))
    );
}

/**
 * Generates a 3D array with the given size and calls a generator function for each element.
 * @param size The size of the 3D array.
 * @param callback The generator function to be called for each element.
 * @returns {T[][][]} The 3D array.
 * @example
 * generate3DArray({ x: 2, y: 2, z: 2 }, (pos) => pos);
 * // The generated 3D array:
 * // [
 * //     [
 * //         [
 * //             { x: 0, y: 0, z: 0 },
 * //             { x: 0, y: 0, z: 1 }
 * //         ],
 * //         [
 * //             { x: 0, y: 1, z: 0 },
 * //             { x: 0, y: 1, z: 1 }
 * //         ]
 * //     ],
 * //     [
 * //         [
 * //             { x: 1, y: 0, z: 0 },
 * //             { x: 1, y: 0, z: 1 }
 * //         ],
 * //         [
 * //             { x: 1, y: 1, z: 0 },
 * //             { x: 1, y: 1, z: 1 }
 * //         ]
 * //     ]
 * // ]
 */
export function generate3DArray<T>(
    size: { x: number; y: number; z: number },
    callback: (
        relativePos: { x: number; y: number; z: number } // The relative position of the element in the array.
    ) => T
): T[][][] {
    return Array.from({ length: size.x }, (_, x) =>
        Array.from({ length: size.y }, (_, y) =>
            Array.from({ length: size.z }, (_, z) => callback({ x, y, z }))
        )
    );
}
