import * as React from "react";
import jasmineEnzyme from "jasmine-enzyme";
import { shallow } from 'enzyme';
import { Autocomplete } from "./autocomplete";
import { articleService } from 'walletApi';

describe("Autocomplete", () => {

    beforeEach(() => {
        jasmineEnzyme();
    });

    it("should an input with the value.", () => {
        const wrapper = shallow(<Autocomplete value="alma" onFilter={articleService.filterBy} name="name" />);
        const input = wrapper.find("input");
        expect(input).toHaveValue("alma");
    });

    it("should write input.", (callback) => {
        const wrapper = shallow(<Autocomplete value="" onFilter={articleService.filterBy} name="name" />);
        const input = wrapper.find("input");
        input.simulate('focus');
        input.simulate('change', { target: { value: 'holiday' }, preventDefault() { } });
        setTimeout(() => {
            input.simulate('keyDown', {
                key: "Enter",
                preventDefault() { }
            });
            expect(wrapper.find("input")).toHaveValue("Pizza Holiday ebéd");
            callback();
        }, 100);
    });
});