import { MoneyDirection, Wallet, Transaction } from "walletApi";
import { _, toUTCDate } from "walletCommon";
import { toDateString } from "./DateTimeFunctions";
import { ValidationConfig } from 'walletCommon/validation';
import * as validators from 'walletCommon/validation/commonValidators';

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

export function getWalletNameById(walletId: number, wallets: Wallet[]): string {
    return _.selectMap<Wallet, string>(wallets, w => w.moneyWalletId === walletId, w => w.name);
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

export function mapTransactionViewModel(transactions: Transaction[], wallets: Wallet[]): TransactionViewModel[] {
    return transactions.map(transaction => <TransactionViewModel>{
        category: transaction.category || "",
        comment: transaction.comment || "",
        createdAt: toDateString(transaction.createdAt),
        direction: transaction.direction,
        name: transaction.name || "",
        price: transaction.value ? transaction.value.toString() : "",
        transactionId: transaction.transactionId,
        walletId: transaction.walletId,
        key: transaction.transactionId,
    });
}


export function mapTransaction(transactions: TransactionViewModel[]): Transaction[] {
    return transactions.map(transaction => <Transaction>{
        category: transaction.category,
        comment: transaction.comment,
        createdAt: toUTCDate(transaction.createdAt),
        direction: parseInt(<any>transaction.direction, 10),
        name: transaction.name,
        value: parseInt(transaction.price, 10),
        transactionId: transaction.transactionId,
        walletId: parseInt(<any>transaction.walletId, 10)
    });
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