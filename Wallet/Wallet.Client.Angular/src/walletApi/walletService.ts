import { WalletApi } from "./api/api";
import { Wallet } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { QueryParams } from "./queryParams";
import "rxjs/add/operator/catch"
import "rxjs/add/observable/throw"
import { ApiError } from "walletApi/apiError";

@Injectable()
export class WalletService {
    constructor(private api: WalletApi) {
        
    }

    getAll(query?: QueryParams) : Observable<Wallet[]> {
        query = query || {};
        return this.decorateCommonCatch(this.api.apiV1WalletGet(query.take, query.skip));
    }

    private decorateCommonCatch<T>(observable: Observable<T>) : Observable<T> {
        return observable.catch((error: Response) => {
                return Observable.throw(new ApiError(error, error.statusText || "Couldn't connect to the server"));
            })
    }
}