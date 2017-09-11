import { Observable } from "rxjs/Observable";
import { Wallet } from "walletApi";
import { ItemId } from "walletCommon";

export class WalletViewModel {
    
    @ItemId()
    moneyWalletId?: number;

    name: string;

    constructor(wallet: Wallet) {
        Object.assign(this, wallet);
    }
}