import * as React from "react";
import { shallow } from "enzyme";
import "jest-enzyme";
import { Pager } from "./pager";

describe("Pager", () => {
    let onPageSelected: (page: number) => void;
    let preventDefault: () => void;
    beforeEach(() => {
        onPageSelected = jasmine.createSpy("onPageSelected");
        preventDefault = jasmine.createSpy("preventDefault");
    });

    afterEach(() => {
    });

    it("should be rendered.", () => {
        const element = shallow(<Pager countAll={100} page={5} pageSize={10} onPageSelected={onPageSelected} />);
        const liElements = element.find(".pagination > li");
        expect(liElements).toBeDefined();
        expect(liElements.length).toBe(10 + 4);
        expect(liElements.at(0)).toHaveText("First");
        expect(liElements.at(1)).toHaveText("Previous");
        for (let index = 1; index < 11; index++) {
            expect(liElements.at(1 + index)).toHaveText(index.toString());
        }
        expect(liElements.at(12)).toHaveText("Next");
        expect(liElements.at(13)).toHaveText("Last");
    });

    it("should call pageSelected on clicking page number.", () => {
        const element = shallow(<Pager countAll={100} page={5} pageSize={10} onPageSelected={onPageSelected} />);
        const liElements = element.find(".pagination > li").children();
        liElements.at(3).simulate("click", {
            preventDefault
        });
        expect(onPageSelected).toHaveBeenCalledWith(2);
        expect(preventDefault).toHaveBeenCalled();
    });

    it("should call pageSelected with prev page on clicking Previous.", () => {
        const element = shallow(<Pager countAll={100} page={5} pageSize={10} onPageSelected={onPageSelected} />);
        const liElements = element.find(".pagination > li").children();
        liElements.at(1).simulate("click", {
            preventDefault
        });
        expect(onPageSelected).toHaveBeenCalledWith(4);
        expect(preventDefault).toHaveBeenCalled();
    });

    it("should call pageSelected with next page on clicking Next.", () => {
        const element = shallow(<Pager countAll={100} page={5} pageSize={10} onPageSelected={onPageSelected} />);
        const liElements = element.find(".pagination > li").children();
        liElements.at(12).simulate("click", {
            preventDefault
        });
        expect(onPageSelected).toHaveBeenCalledWith(6);
        expect(preventDefault).toHaveBeenCalled();
    });

    it("should call pageSelected with first page on clicking First.", () => {
        const element = shallow(<Pager countAll={100} page={5} pageSize={10} onPageSelected={onPageSelected} />);
        const liElements = element.find(".pagination > li").children();
        liElements.at(0).simulate("click", {
            preventDefault
        });
        expect(onPageSelected).toHaveBeenCalledWith(1);
        expect(preventDefault).toHaveBeenCalled();
    });

    it("should call pageSelected with last page on clicking Last.", () => {
        const element = shallow(<Pager countAll={100} page={5} pageSize={10} onPageSelected={onPageSelected} />);
        const liElements = element.find(".pagination > li").children();
        liElements.at(13).simulate("click", {
            preventDefault
        });
        expect(onPageSelected).toHaveBeenCalledWith(10);
        expect(preventDefault).toHaveBeenCalled();
    });

});
