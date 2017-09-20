import { TransactionApi } from "./api/api";
import { Transaction } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { QueryParams } from "./queryParams";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";

@Injectable()
export class TrasactionsService {
    constructor(private api: TransactionApi) {

    }

    batchUpdate(transactions: Transaction[]): Observable<Transaction[]> {
        return decorateCommonCatch(this.api.batchSave(transactions));
    }

    fetch(query: QueryParams): Observable<Transaction[]> {
        return decorateCommonCatch(this.api.getAll(query.search, query.skip, query.take));
    }
}