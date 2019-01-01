import _ from "./index";

describe("listHelpers", () => {
    describe("removeByIndex", () => {
        it("returns a new list without the element at index", () => {
            const a = {};
            const result = _.removeByIndex([{}, a, {}], 1);

            expect(result).toBeDefined();
            expect(result.length).toBe(2);
            expect(result).not.toContain(a);
        });

        it("don't modify the original list", () => {
            const a = [{}, {}, {}];
            const result = _.removeByIndex(a, 1);

            expect(result).not.toBe(a);
            expect(a).toHaveLength(3);
        });

    });
});
