import { Transaction } from "walletApi";
import { ListHelpers } from "walletCommon";
import * as moment from "moment";
import { dateFormat } from "app/common/constants";

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
        public original: Transaction) {
        Object.assign(this, original);
    }

    get price() {
        return this.value * this.direction;
    }

    get createdAtText() {
        return moment(this.createdAt).format(dateFormat);
    }

    set createdAtText(value: string) {
        this.createdAt = moment(value).toDate();
    }

    cancel() {
        Object.assign(this, this.original);
        this.editMode = false;
    }
}