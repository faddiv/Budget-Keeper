import { TransactionSummaryActions } from "./transactionsSummary";

export function createTransactionSummaryActionsMocks(): typeof TransactionSummaryActions {
    return {
        transactionsSelected: jasmine.createSpy("transactionsSelected")
    };
}
