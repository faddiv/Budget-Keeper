import { createAction } from 'redux-actions';
import { Actions } from '../constants/actions';
import { AlertMessage } from 'reducers/alerts/alertsModel';

export const showAlert = createAction<AlertMessage>(Actions.showAlertType);
export const dismissAlert = createAction<AlertMessage>(Actions.dismissAlert);
export const dismissAllAlert = createAction(Actions.dismissAllAlert);