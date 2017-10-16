import { ListHelpers } from "./listHelpers";

describe("ListHelpers", () => {
    describe("remove", () => {
        var itemToRemove: Dummy1;
        var list: Dummy1[];
        beforeEach(() => {
            itemToRemove = new Dummy1("Asd");
            list = [itemToRemove, new Dummy1("bsd")];
        });

        it("returns a new list without the itemToRemove", () => {
            var newList = ListHelpers.remove(list, itemToRemove);
            expect(newList.length).toBe(1);
            expect(newList).not.toContain(itemToRemove);
        });

        it("leaves the original list untouched", () => {
            var newList = ListHelpers.remove(list, itemToRemove);
            expect(list.length).toBe(2);
            expect(list).toContain(itemToRemove);
        });
        
        it("returns an empty list on undefined list", () => {
            var newList = ListHelpers.remove<Dummy1>(<any>undefined, itemToRemove);
            expect(newList).toBeDefined();
            expect(newList.length).toBe(0);
        });
    });
    
    describe("selectMap", () => {
        beforeEach(() => {
        });
        it("returns the first item selected by first callback and mapped by second", () => {
            var itemToRemove = new Dummy1("Asd");
            var list = [new Dummy1("ccc"), itemToRemove, new Dummy1("bsd")];
            var item = ListHelpers.selectMap(list, d => d.val1 === "Asd", d => d.val1);
            expect(item).toBe("Asd");
        });
        
        it("returns undefined if no match", () => {
            var itemToRemove = new Dummy1("Asd");
            var list = [new Dummy1("ccc"), itemToRemove, new Dummy1("bsd")];
            var item = ListHelpers.selectMap(list, d => d.val1 === "aaa", d => d.val1);
            expect(item).toBeUndefined();
        });
        
        it("returns undefined if no list", () => {
            var item = ListHelpers.selectMap<any, any>(undefined, d => d.val1 === "aaa", d => d.val1);
            expect(item).toBeUndefined();
        });
    });
});

class Dummy1 {
    constructor(public val1: string) { }
}
