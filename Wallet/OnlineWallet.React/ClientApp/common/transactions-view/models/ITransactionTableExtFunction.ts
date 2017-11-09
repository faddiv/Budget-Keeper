import { Transaction } from "walletApi";

export interface ITransactionTableExtFunction {
    (item: Transaction): string;
}
