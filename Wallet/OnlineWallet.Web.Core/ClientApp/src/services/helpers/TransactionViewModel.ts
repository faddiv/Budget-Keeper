import { toDateString, toUTCDate } from "./DateTimeFunctions";
import { MoneyDirection, Wallet, Transaction } from "../walletApi";
import _ from "./listHelpers";
import { validators, ValidationConfig } from "./validation";

export interface TransactionViewModel {
    comment?: string;

    createdAt?: string;

    direction?: MoneyDirection;

    transactionId?: number;

    name?: string;

    category?: string;

    price?: string;

    walletId?: number;

    key?: number;
}

export type ITransactionTableExtFunction = (item: TransactionViewModel) => string;

export function getWalletNameById(walletId: number | undefined, wallets: Wallet[]) {
    return _.selectMap(wallets, w => w.moneyWalletId === walletId, w => w.name);
}

export function nextDirection(direction: MoneyDirection) {
    switch (direction) {
        case MoneyDirection.Expense:
            return MoneyDirection.Income;
        case MoneyDirection.Income:
            return MoneyDirection.Plan;
        case MoneyDirection.Plan:
            return MoneyDirection.Expense;
    }
}

export function mapTransactionViewModel(transactions: Transaction[]): TransactionViewModel[] {
    return transactions.map(transaction => {
        return {
            category: transaction.category || "",
            comment: transaction.comment || "",
            createdAt: toDateString(transaction.createdAt),
            direction: transaction.direction,
            name: transaction.name || "",
            price: transaction.value ? transaction.value.toString() : "",
            transactionId: transaction.transactionId,
            walletId: transaction.walletId,
            key: transaction.transactionId
        };
    });
}

export function mapTransaction(transactions: TransactionViewModel[]): Transaction[] {
    return transactions.map(transaction => {
        return {
            category: transaction.category,
            comment: transaction.comment,
            createdAt: toUTCDate(transaction.createdAt),
            direction: parseInt(transaction.direction as any, 10),
            name: transaction.name,
            value: transaction.price ? parseInt(transaction.price, 10) : 0,
            transactionId: transaction.transactionId,
            walletId: parseInt(transaction.walletId as any, 10)
        } as Transaction;
    });
}

export function getDirectionColoring(item: TransactionViewModel): string {
    switch (item.direction) {
        case MoneyDirection.Income:
            return "table-success";
        case MoneyDirection.Plan:
            return "table-warning";
        default:
            return "";
    }
}

export const transactionRules: ValidationConfig<TransactionViewModel, any> = {
    name: {
        validators: [
            {
                validator: validators.required,
                message: "Name is reuired."
            }
        ],
        valueGetter: state => state.name
    },
    price: {
        validators: [
            {
                validator: validators.required,
                message: "Price is reuired."
            }
        ],
        valueGetter: state => state.price
    }
};
