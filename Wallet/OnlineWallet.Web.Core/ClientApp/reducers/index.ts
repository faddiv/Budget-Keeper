import { combineReducers } from "redux";
import alerts, { AlertsModel } from "./alerts/alertsModel";
import wallets, { WalletsModel } from "reducers/wallets/walletsReducers";
import transactionSummary, { TransactionSummaryViewModel } from "reducers/transactionSummary/transactionSummaryReducers";

export interface RootState {
    alerts: AlertsModel;
    wallets: WalletsModel;
    transactionSummary: TransactionSummaryViewModel;
}

export const rootReducer = combineReducers<RootState>({
    alerts,
    wallets,
    transactionSummary
});
