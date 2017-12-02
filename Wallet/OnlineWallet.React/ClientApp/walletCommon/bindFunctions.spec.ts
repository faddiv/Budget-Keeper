import { bind } from "./bindFunctions";

class Dummy {

    constructor(public i: number) {

    }
    test1() { 
        return this && this.i; 
    }

    @bind
    test2() { 
        return this.i; 
    }
}

describe("bind", () => {
    it("create hard binding on function", () => {
        var dummy = new Dummy(1);
        var test1 = dummy.test1;
        var test2 = dummy.test2;
        expect(test1()).toBeFalsy();
        expect(test2()).toBeTruthy();
    });
});
