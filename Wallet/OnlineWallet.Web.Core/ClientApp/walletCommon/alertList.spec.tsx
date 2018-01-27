import * as React from "react";
import * as jasmineEnzyme from "jasmine-enzyme";
import { shallow, render, mount } from "enzyme";
import { AlertList } from "./alertList";
import { delay } from "helpers";
import { AlertMessage } from "reducers/alerts/alertsModel";

describe("AlertList", () => {

    beforeEach(() => {
        (jasmineEnzyme as any)();
    });

    afterEach(() => {
    });

    it("should show alert with type specified class.", () => {
        const alerts: AlertMessage[] = [
            {
                type: "danger",
                message: "asdf"
            }
        ];
        // AlertList = (AlertList as any).WrappedComponent; //Can fix the error but syntactycally not correct.
        const element = shallow(<AlertList alerts={alerts} />);
        const dangerElement = element.find(".alert.alert-danger");
        expect(dangerElement).not.toBeUndefined();
    });
});
