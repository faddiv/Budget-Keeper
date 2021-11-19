import { createAction } from "redux-actions";
import { Actions } from "../constants/actions";
import { TransactionViewModel } from "../walletCommon";

export type TransactionSummaryViewModel = TransactionViewModel[];

export const TransactionSummaryActions = {
    transactionsSelected: createAction<TransactionSummaryViewModel>(Actions.transactionsSelected)
}
