import * as React from "react";
import * as jasmineEnzyme from "jasmine-enzyme";
import { shallow, render, mount } from "enzyme";
import * as fetchMock from "fetch-mock";
import { NameInput } from "./nameInput";
import { ArticleModel } from "walletApi";

describe("NameInput", () => {

    beforeEach(() => {
        (jasmineEnzyme as any)();
    });

    afterEach(() => {
        fetchMock.restore();
    });

    it("should return result from articleApi.", (callback) => {
        const filterResult: ArticleModel[] = [
            {
                name: "Pizza Holiday ebéd",
                nameHighlighted: "Pizza <strong>Holiday</strong> ebéd",
                category: "a",
                lastPrice: 100,
                occurence: 1
            }
        ];
        fetchMock.get(/.*\/api\/v1\/Article.*/, filterResult);
        const wrapper = mount(<NameInput value="" />);
        const input = wrapper.find("input");
        input.simulate("focus");
        input.simulate("change", { target: { value: "holiday" }, preventDefault() { } });
        setTimeout(() => {
            input.simulate("keyDown", {
                key: "Enter",
                preventDefault() { }
            });
            expect(wrapper.find("input")).toHaveValue("Pizza Holiday ebéd");
            callback();
        }, 0);
    });
});
