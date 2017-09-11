import { ListHelpers, ItemId } from "./listHelpers";

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
        it("returns the index by key", () => {
            var itemToRemove = new Dummy2("Asd");
            var list = [new Dummy2("ccc"), itemToRemove, new Dummy2("bsd")];
            var index = ListHelpers.indexById(list, new Dummy2("Asd"));
            expect(index).toBe(1);
        });
        
        it("use object as key if no ItemId is defined", () => {
            var itemToRemove = new Dummy1("Asd");
            var list = [new Dummy1("ccc"), itemToRemove, new Dummy1("bsd")];
            var index = ListHelpers.indexById(list, itemToRemove);
            expect(index).toBe(1);
        });
    });
});

class Dummy1 {
    constructor(public val1: string) { }
}

class Dummy2 {
    @ItemId()
    public val1: string

    constructor(
        val1: string
    ) {
        this.val1 = val1;
    }
}