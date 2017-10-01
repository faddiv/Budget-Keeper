import { Transaction, Wallet } from "walletApi";
import { ListHelpers } from "walletCommon";
import * as moment from "moment";



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
    editMode: boolean;
    changed: boolean;

    constructor(
        public original: Transaction,
        wallets: Wallet[]) {
        Object.assign(this, original);
        this.walletName = ListHelpers.selectMap<Wallet, string>(wallets, w => w.moneyWalletId == this.walletId, w => w.name);
    }

    get price() {
        return this.value * this.direction;
    }

    get createdAtText() {
        return moment(this.createdAt).format("YYYY-MM-DD");
    }

    set createdAtText(value: string) {
        this.createdAt = moment(value).toDate();
    }

    cancel() {
        Object.assign(this, this.original);
        this.editMode = false;
    }
}