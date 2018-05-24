import _ from "./listHelpers";

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

    describe("replace", () => {
        const a = {};
        const b = {};
        const list = [{}, a, {}];

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
    });

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

    describe("findLast", () => {
        const list = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }];

        it("finds last element matches the predicate", () => {
            var result = _.findLast(list, val => val.id === 2);

            expect(result).toBe(list[3]);
        });

        it("returns undefined of no matches", () => {
            var result = _.findLast(list, val => val.id === 12);

            expect(result).toBeUndefined();
        });

        it("second argument of predicate is index", () => {
            var result = _.findLast(list, (_, i) => i === 2);

            expect(result).toBe(list[2]);
        });

        it("third argument of predicate is the full list", () => {
            _.findLast(list, function (_, _i, l) {
                expect(l).toBe(list);
                return false;
            });
        });

        it("if thisArg is provided, then in the predicate this become the given object", () => {

            function predicate(this: typeof list) {
                expect(this).toBe(list);
                return false;
            }
            _.findLast(list, predicate, list);
        });
    });
});