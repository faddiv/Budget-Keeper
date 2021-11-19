import { combineReducers } from "redux";
import alerts, { AlertsModel } from "./alerts/alertsModel";
import wallets, { WalletsModel } from "./wallets/walletsReducers";
import transactionSummary, { TransactionSummaryViewModel } from "./transactionSummary/transactionSummaryReducers";

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
