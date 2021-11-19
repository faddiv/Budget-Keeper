import { AlertsActions } from "./alerts";

export function createAlertsActionsMock(): typeof AlertsActions {
    return {
        dismissAlert: jasmine.createSpy("dismissAlert"),
        dismissAllAlert: jasmine.createSpy("dismissAllAlert"),
        showAlert: jasmine.createSpy("showAlert")
    };
}
