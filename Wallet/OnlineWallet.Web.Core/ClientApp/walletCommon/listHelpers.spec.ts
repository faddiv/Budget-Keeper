import { ListHelpers } from "./listHelpers";

describe("ListHelpers", () => {
    describe("remove", () => {
        var itemToRemove: Dummy1;
        var list: Dummy1[];
        beforeEach(() => {
            itemToRemove = new Dummy1("Asd");
            list = [itemToRemove, new Dummy1("bsd")];
        });

        it("removes item by ref", () => {
            ListHelpers.remove(list, itemToRemove);
            expect(list.length).toBe(1);
            expect(list).not.toContain(itemToRemove);
        });

        it("returns the index of the removed", () => {
            var index = ListHelpers.remove(list, itemToRemove);
            expect(index).toBe(0);
        });
    });
    describe("indexById", () => {
        beforeEach(() => {
        });

        it("use object as key if no ItemId is defined", () => {
            var itemToRemove = new Dummy1("Asd");
            var list = [new Dummy1("ccc"), itemToRemove, new Dummy1("bsd")];
            var index = ListHelpers.indexById(list, itemToRemove);
            expect(index).toBe(1);
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
