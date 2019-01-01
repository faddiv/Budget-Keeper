import _ from "./index";

describe("listHelpers", () => {
    describe("contains", () => {
        const a = {};
        const list = [{}, a, {}];

        it("returns true if element in the list by ref", () => {
            const result = _.contains(list, a);

            expect(result).toBe(true);
        });

        it("returns false if element not in the list by ref", () => {
            const result = _.contains(list, {});

            expect(result).toBe(false);
        });
    });
});
