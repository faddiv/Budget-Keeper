import { Observable } from "rxjs/Observable";
import { Wallet } from "walletApi";

export class WalletViewModel {
    
    moneyWalletId?: number;

    name: string;

    constructor(wallet: Wallet) {
        Object.assign(this, wallet);
    }
}