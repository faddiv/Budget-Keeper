import * as React from "react";
import { shallow } from "enzyme";
import "jest-enzyme";
import { Autocomplete, AutocompleteModel } from "./autocomplete";

describe("Autocomplete", () => {
    let filterResult: AutocompleteModel[];

    const filter = () => Promise.resolve(filterResult);
    beforeEach(() => {
    });

    it("should an input with the value.", () => {
        const wrapper = shallow(<Autocomplete value="alma" onFilter={filter} name="name" />);
        const input = wrapper.find("input");
        expect(input).toHaveValue("alma");
    });

    it("should write input.", (callback) => {
        filterResult = [
            {
                name: "Pizza Holiday ebéd",
                nameHighlighted: "Pizza <strong>Holiday</strong> ebéd"
            }
        ];
        const wrapper = shallow(<Autocomplete value="" onFilter={filter} name="name" />);
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
