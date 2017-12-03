import { TransactionViewModel } from "./TransactionViewModel";

export interface ITransactionTableExtFunction {
    (model: TransactionViewModel): void;
}
