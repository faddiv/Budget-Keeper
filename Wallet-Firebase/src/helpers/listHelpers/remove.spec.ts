import _ from "./index";

describe("listHelpers", () => {
    describe("remove", () => {
        it("returns a new list without the given element", () => {
            const a = {};
            const result = _.remove([{}, a, {}], a);

            expect(result).toBeDefined();
            expect(result.length).toBe(2);
            expect(result).not.toContain(a);
        });

        it("don't modify the original list", () => {
            const a = [{}, {}, {}];
            const result = _.remove(a, a[1]);

            expect(result).not.toBe(a);
            expect(a).toHaveLength(3);
        });

        it("if undefined list provided returns an empty list", () => {
            const result = _.remove(undefined, {});

            expect(result).toBeDefined();
            expect(result).toHaveLength(0);
        });

        it("uses reference equality", () => {
            const result = _.remove([{ id: 5 }], { id: 5 });

            expect(result).toHaveLength(1);
        });
    });
});
