import { createAction } from "redux-actions";
import { Actions } from "../constants/actions";
import { AlertMessage } from "../reducers/alerts/alertsModel";

export const AlertsActions = {
    showAlert: createAction<AlertMessage>(Actions.showAlertType),
    dismissAlert: createAction<AlertMessage>(Actions.dismissAlert),
    dismissAllAlert: createAction(Actions.dismissAllAlert)
}
