import { combineReducers } from "redux";
import alerts, { AlertsModel } from "./alerts/alertsModel";
import wallets, { WalletsModel } from "reducers/wallets/walletsReducers";

export interface RootState {
    alerts: AlertsModel;
    wallets: WalletsModel;
}

export var rootReducer = combineReducers<RootState>({
    alerts,
    wallets
});
