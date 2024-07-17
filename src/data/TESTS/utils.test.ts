import { elementInSet, elementInArray } from "@/data/utils";

describe("elementInSet", () => {
    it("should return true if the element is in the set", () => {
        const set = new Set([1, 2, 3]);
        expect(elementInSet(2, set)).toBe(true);

        const set2 = new Set([{ a: 1 }, { a: 2 }, { a: 3 }]);
        expect(elementInSet({ a: 2 }, set2)).toBe(true);
    });

    it("should return false if the element is not in the set", () => {
        const set = new Set([1, 2, 3]);
        expect(elementInSet(4, set)).toBe(false);

        const set2 = new Set([{ a: 1 }, { a: 2 }, { a: 3 }]);
        expect(elementInSet({ a: 4 }, set2)).toBe(false);
    });
});

describe("elementInArray", () => {
    it("should return true if the element is in the array", () => {
        const array = [1, 2, 3];
        expect(elementInArray(2, array)).toBe(true);

        const array2 = [{ a: 1 }, { a: 2 }, { a: 3 }];
        expect(elementInArray({ a: 2 }, array2)).toBe(true);
    });

    it("should return false if the element is not in the array", () => {
        const array = [1, 2, 3];
        expect(elementInArray(4, array)).toBe(false);

        const array2 = [{ a: 1 }, { a: 2 }, { a: 3 }];
        expect(elementInArray({ a: 4 }, array2)).toBe(false);
    });
});
