import deepEqual from "deep-equal";

export function elementInSet<T>(element: T, set: Set<T>): boolean {
    for (const e of set) {
        if (deepEqual(e, element)) return true;
    }

    return false;
}

export function elementInArray<T>(element: T, array: T[]): boolean {
    for (const e of array) {
        if (deepEqual(e, element)) return true;
    }

    return false;
}
