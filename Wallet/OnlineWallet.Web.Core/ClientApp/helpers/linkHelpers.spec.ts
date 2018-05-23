import { ThenJson, jsonRequestInit } from "./linkHelpers";

describe("linkHelpers", () => {

    describe("ThenJson", () => {

        it("throws error if response is not ok", () => {
            expect(() => {
                ThenJson({
                    ok: false
                } as any);
            }).toThrowError();
        });

        it("call json() if it is ok", () => {
            const result = Promise.resolve();
            expect(ThenJson({
                ok: true,
                json() {
                    return result;
                }
            } as any)).toBe(result);
        });
    });

    describe("jsonRequestInit", () => {

        it("creates a RequestInit", () => {
            const result = jsonRequestInit({}, "POST");

            expect(result).toBeDefined();
        });

        it("json serializes the data into body", () => {
            const val = { a: 1 };
            const result = jsonRequestInit(val, "POST");

            expect(result.body).toBe(JSON.stringify(val));
        });

        it("initialize the method with the input method", () => {
            const result = jsonRequestInit({}, "POST");

            expect(result.method).toBe("POST");
        });

        it("adds the extra data", () => {
            const result = jsonRequestInit({}, "POST", {
                mode: "navigate"
            });

            expect(result.mode).toBe("navigate");
        });

    });
});
