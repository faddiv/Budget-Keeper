import { WalletApi } from "./api/api";
import { Wallet } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { QueryParams } from "./queryParams";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";

@Injectable()
export class WalletService {
    constructor(private api: WalletApi) {

    }

    getAll(query?: QueryParams): Observable<Wallet[]> {
        query = query || {};
        return decorateCommonCatch(this.api.apiV1WalletGet(query.search, query.skip, query.take));
    }

    update(wallet: Wallet): Observable<Wallet> {
        return decorateCommonCatch(this.api.apiV1WalletByIdPut(wallet.moneyWalletId, wallet));
    }

    insert(wallet: Wallet): Observable<Wallet> {
        return decorateCommonCatch(this.api.apiV1WalletPost(null, wallet.name));
    }

    delete(wallet: Wallet): Observable<any> {
        return decorateCommonCatch(this.api.apiV1WalletByIdDelete(wallet.moneyWalletId));
    }
}