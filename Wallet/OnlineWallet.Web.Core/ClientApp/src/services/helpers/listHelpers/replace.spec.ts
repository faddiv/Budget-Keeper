import _ from "./index";

describe("listHelpers", () => {
    describe("replace", () => {
        const a = {};
        const b = {};
        const list = [{}, a, {}];

        it("doesn't mutate the original list", () => {
            const result = _.replace(list, b, a);

            expect(result).not.toBe(list);
        });

        it("replaces the given element", () => {
            const result = _.replace(list, b, a);

            expect(result).toContain(b);
            expect(result).not.toContain(a);
        });

        it("uses reference equality", () => {
            const result = _.replace([{ id: 5 }], {}, { id: 5 });

            expect(result[0].id).toBe(5);
        });

        it("don't add element if not found by default", () => {
            const result = _.replace(list, b, {});

            expect(result).not.toContain(b);
        });

        it("add element at the end if addElementIfNew is true", () => {
            const result = _.replace(list, b, {}, true);

            expect(result[result.length - 1]).toBe(b);
        });

        it("returns original list if replace element with same element when addElementIfNew is default", () => {
            const result = _.replace(list, a, a);

            expect(result).toBe(list);
        });
    });
});
