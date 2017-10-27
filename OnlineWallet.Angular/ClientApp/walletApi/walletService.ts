import { WalletApi } from "./api/api";
import { Wallet } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { QueryParams } from "./model/models";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";
import 'rxjs/add/operator/publishReplay';
import "rxjs/add/operator/catch";

@Injectable()
export class WalletService {
    private cache: Observable<Wallet[]>;
    constructor(private api: WalletApi) {

    }

    getAll(): Observable<Wallet[]> {
        if(!this.cache) {
            this.cache = decorateCommonCatch(this.api.getAll())
                .catch<Wallet[], Wallet[]>(error => this.cache = null)
                .publishReplay(1)
                .refCount()
        }
        return this.cache;
    }
    
    searchBy(query?: QueryParams): Observable<Wallet[]> {
        query = query || {};
        return decorateCommonCatch(this.api.getAll(query.search, query.skip, query.take, query.sorting));
    }

    update(wallet: Wallet): Observable<Wallet> {
        this.cache = null;
        return decorateCommonCatch(this.api.put(wallet.moneyWalletId, wallet));
    }

    insert(wallet: Wallet): Observable<Wallet> {
        this.cache = null;
        return decorateCommonCatch(this.api.post(wallet));
    }

    delete(wallet: Wallet): Observable<any> {
        this.cache = null;
        return decorateCommonCatch(this.api._delete(wallet.moneyWalletId));
    }
}
