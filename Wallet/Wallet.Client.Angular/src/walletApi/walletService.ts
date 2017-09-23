import { WalletApi } from "./api/api";
import { Wallet } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { QueryParams } from "./model/models";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";

@Injectable()
export class WalletService {
    constructor(private api: WalletApi) {

    }

    getAll(query?: QueryParams): Observable<Wallet[]> {
        query = query || {};
        return decorateCommonCatch(this.api.getAll(query.search, query.skip, query.take, query.sorting));
    }

    update(wallet: Wallet): Observable<Wallet> {
        return decorateCommonCatch(this.api.put(wallet.moneyWalletId, wallet));
    }

    insert(wallet: Wallet): Observable<Wallet> {
        return decorateCommonCatch(this.api.post(null, wallet.name));
    }

    delete(wallet: Wallet): Observable<any> {
        return decorateCommonCatch(this.api._delete(wallet.moneyWalletId));
    }
}