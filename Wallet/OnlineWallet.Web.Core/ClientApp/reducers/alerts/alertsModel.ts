import { Action } from "redux";
import { _ } from "helpers";
import { handleActions } from "redux-actions";
import { Actions } from "constants/actions";

export interface AlertMessage {
    type: AlertMessageType;
    message: string;
}
export interface AlertsAction extends Action {
    alert: AlertMessage;
}

export type AlertMessageType = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

export type AlertsModel = AlertMessage[];

export default handleActions<AlertsModel, AlertMessage>({
    [Actions.showAlertType](state, action) {
        return [...state, action.payload];
    },
    [Actions.dismissAlert](state, action) {
        return _.remove(state, action.payload);
    },
    [Actions.dismissAllAlert](state, action) {
        return [];
    }
}, []);
