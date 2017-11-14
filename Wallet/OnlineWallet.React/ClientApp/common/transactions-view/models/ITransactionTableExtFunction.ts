import { Transaction } from "walletApi";
import { TransactionViewModel } from "common/models";

export interface ITransactionTableExtFunction {
    (item: TransactionViewModel): string;
}
