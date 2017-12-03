import * as React from "react";
import jasmineEnzyme from "jasmine-enzyme";
import { shallow } from 'enzyme';
import { NameInput } from "./nameInput";

describe("NameInput", () => {

    beforeEach(() => {
        jasmineEnzyme();
    });

    it("should an input with the value.", () => {
        const wrapper = shallow(<NameInput value="alma" />);
        const input = wrapper.find("input");
        expect(input).toHaveValue("alma");
    });

    it("should write input.", (callback) => {
        const wrapper = shallow(<NameInput value="" />);
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