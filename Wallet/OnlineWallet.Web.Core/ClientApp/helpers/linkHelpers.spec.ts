import { ThenJson, jsonRequestInit, buildUrl } from "./linkHelpers";

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

    describe("buildUrl", () => {
        
        it("returns with the provided base url", () => {
            const url = buildUrl(["/url"]);

            expect(url).toBe("/url");
        });
        
        it("adds / to the base url", () => {
            const url = buildUrl(["url"]);

            expect(url).toBe("/url");
        });
        
        it("concats the base urls", () => {
            const url = buildUrl(["url", "url2", "/url3"]);

            expect(url).toBe("/url/url2/url3");
        });
        
        it("the base urls concatenation doesn't duplicate /", () => {
            const url = buildUrl(["/url/", "/url2/"]);

            expect(url).toBe("/url/url2");
        });
        
        it("handles absolute http urls", () => {
            const url = buildUrl(["http://domain.com/", "/url"]);

            expect(url).toBe("http://domain.com/url");
        });
        
        it("handles absolute https urls", () => {
            const url = buildUrl(["https://domain.com/", "/url"]);

            expect(url).toBe("https://domain.com/url");
        });
        
        it("adds query params", () => {
            const url = buildUrl(["/url"], { id: 5, q: "asdf" });

            expect(url).toBe("/url?id=5&q=asdf");
        });
        
        it("skips undefined query params", () => {
            const url = buildUrl(["/url"], { id: 5, q: undefined });

            expect(url).toBe("/url?id=5");
        });
        
        it("skips null query params", () => {
            const url = buildUrl(["/url"], { id: 5, q: null });

            expect(url).toBe("/url?id=5");
        });
        
        it("skips empty string query params", () => {
            const url = buildUrl(["/url"], { id: 5, q: "" });

            expect(url).toBe("/url?id=5");
        });
        
        it("doesn't skips 0 query params", () => {
            const url = buildUrl(["/url"], { id: 5, q: 0 });

            expect(url).toBe("/url?id=5&q=0");
        });
    });
});
