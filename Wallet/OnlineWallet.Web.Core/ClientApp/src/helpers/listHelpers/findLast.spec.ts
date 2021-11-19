import _ from "./index";

describe("listHelpers", () => {
    describe("findLast", () => {
        const list = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }];

        it("finds last element matches the predicate", () => {
            const result = _.findLast(list, val => val.id === 2);

            expect(result).toBe(list[3]);
        });

        it("returns undefined of no matches", () => {
            const result = _.findLast(list, val => val.id === 12);

            expect(result).toBeUndefined();
        });

        it("second argument of predicate is index", () => {
            const result = _.findLast(list, (_v, i) => i === 2);

            expect(result).toBe(list[2]);
        });

        it("third argument of predicate is the full list", () => {
            _.findLast(list, (_v, _i, l) => {
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
