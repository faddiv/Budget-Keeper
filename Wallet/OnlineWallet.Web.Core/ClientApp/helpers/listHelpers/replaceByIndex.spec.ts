import _ from "./index";

describe("listHelpers", () => {
    describe("replaceByIndex", () => {
        const a = {};
        const b = {};
        const list = [{}, a, {}];

        it("doesn't mutate original list", () => {
            _.replaceByIndex(list, b, 1);

            expect(list).toContain(a);
            expect(list).not.toContain(b);
        });

        it("replace element by index", () => {
            const result = _.replaceByIndex(list, b, 1);

            expect(result).toContain(b);
            expect(result).not.toContain(a);
        });

        it("returns original list if replace element with same element", () => {
            const result = _.replaceByIndex(list, a, 1);

            expect(result).toBe(list);
        });
    });
});
