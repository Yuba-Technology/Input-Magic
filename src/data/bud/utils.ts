import { Block, BlockPos } from "@/data/map/block";
import { Chunk } from "@/data/map/chunk";
import { Dimension } from "@/data/map/dimension";

/**
 * Get the plane adjacent coordinates of the given coordinates.
 * @param pos The coordinate.
 * @returns The plane adjacent coordinates.
 */
export function getPlaneAdjacent(pos: BlockPos): BlockPos[] {
    const { x, y, z } = pos;
    return [
        { x: x - 1, y, z },
        { x: x + 1, y, z },
        { x, y: y - 1, z },
        { x, y: y + 1, z }
    ];
}

/**
 * Get the space adjacent coordinates of the given coordinates.
 * @param pos The coordinate.
 * @returns The space adjacent coordinates.
 */
export function getSpaceAdjacent(pos: BlockPos): BlockPos[] {
    const { x, y, z } = pos;
    const adjacentPositions = [
        { x: x - 1, y, z },
        { x: x + 1, y, z },
        { x, y: y - 1, z },
        { x, y: y + 1, z }
    ];

    if (z > 0) adjacentPositions.push({ x, y, z: z - 1 });
    if (z < Chunk.HEIGHT - 1) adjacentPositions.push({ x, y, z: z + 1 });

    return adjacentPositions;
}

/**
 * Get the plane adjacent blocks of the given coordinates.
 * @param pos The coordinate.
 * @returns The plane adjacent blocks.
 */
export function getPlaneAdjacentBlocks(
    dimension: Dimension,
    pos: BlockPos
): Block[] {
    const coordinates = getPlaneAdjacent(pos);
    return coordinates.map((pos) => dimension.getBlock(pos)!);
}

/**
 * Get the space adjacent blocks of the given coordinates.
 * @param pos The coordinate.
 * @returns The space adjacent blocks.
 */
export function getSpaceAdjacentBlocks(
    dimension: Dimension,
    pos: BlockPos
): Block[] {
    const coordinates = getSpaceAdjacent(pos);
    return coordinates.map((pos) => dimension.getBlock(pos)!);
}

// /**
//  * Get the diagonal adjacent coordinates of the given coordinates.
//  * @param pos The coordinate.
//  * @returns The diagonal adjacent coordinates.
//  */
// export function getDiagonalAdjacent(pos: BlockPos): BlockPos[] {
//     const { x, y, z } = pos;
//     return [
//         { x: x - 1, y: y - 1, z },
//         { x: x - 1, y: y + 1, z },
//         { x: x + 1, y: y - 1, z },
//         { x: x + 1, y: y + 1, z }
//     ];
// }

// /**
//  * Get the adjacent coordinates of the given coordinates.
//  * @param pos The coordinate.
//  * @returns The adjacent coordinates.
//  */
// export function getAdjacent(pos: BlockPos): BlockPos[] {
//     return [
//         ...getPlaneAdjacent(pos),
//         ...getSpaceAdjacent(pos),
//         ...getDiagonalAdjacent(pos)
//     ];
// }
