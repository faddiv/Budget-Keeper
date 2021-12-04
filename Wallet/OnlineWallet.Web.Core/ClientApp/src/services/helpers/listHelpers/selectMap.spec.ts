import _ from "./index";

describe("listHelpers", () => {
    describe("selectMap", () => {

        it("filters and maps the given list and selects the first element", () => {
            const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const result = _.selectMap(list, val => val.id === 2, val => val.id);

            expect(result).toBe(2);
        });

        it("returns undefined if no element matches", () => {
            const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const result = _.selectMap(list, val => val.id === 5, val => val.id);

            expect(result).toBeUndefined();
        });

        it("returns undefined if list is undefined", () => {
            const result = _.selectMap(undefined as any, val => val === 5, val => val);

            expect(result).toBeUndefined();
        });
    });
});
