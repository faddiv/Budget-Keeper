import { bind } from "bind-decorator";

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
        const dummy = new Dummy(1);
        const test1 = dummy.test1;
        const test2 = dummy.test2;
        expect(test1()).toBeFalsy();
        expect(test2()).toBeTruthy();
    });
});
