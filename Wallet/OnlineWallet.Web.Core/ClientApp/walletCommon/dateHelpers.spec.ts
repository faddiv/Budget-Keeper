import { toUTCDate } from "./dateHelpers";

describe("dateHelpers", () => {
    describe("toUTCDate", () => {
        it("returns a correctly serializable date.", () => {
            var result = toUTCDate("2017-10-15");
            var json = JSON.stringify(result);
            expect(json).toBe('"2017-10-15T00:00:00.000Z"');
        });
        it("empty string should return undefined.", () => {
            var result = toUTCDate("");
            var json = JSON.stringify({st:result});
            expect(json).toBe('{}');
        });
    });
});