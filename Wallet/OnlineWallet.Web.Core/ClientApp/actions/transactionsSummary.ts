import { createAction } from "redux-actions";
import { Actions } from "../constants/actions";
import { TransactionViewModel } from "walletCommon";

export type TransactionSummaryViewModel = TransactionViewModel[];

export namespace TransactionSummaryActions {
    export const transactionsSelected = createAction<TransactionSummaryViewModel>(Actions.transactionsSelected);
}
