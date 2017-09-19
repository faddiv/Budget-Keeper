import { Transaction, Wallet } from "walletApi";
import { ListHelpers } from "walletCommon";

export class TransactionViewModel implements Transaction {
    comment?: string;
    createdAt: Date;
    direction: Transaction.DirectionEnum;
    transactionId?: number;
    name: string;
    value: number;
    walletId: number;
    walletName: string;

    cssClass: string;

    constructor(original: Transaction, wallets: Wallet[]) {
        Object.assign(this, original);
        this.walletName = ListHelpers.selectMap<Wallet,string>(wallets, w => w.moneyWalletId == this.walletId, w => w.name);
        this.cssClass = this.transactionId ? "info" : undefined;
    }

    get price() {
        return this.value * this.direction;
    }
}