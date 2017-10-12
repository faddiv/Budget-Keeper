import { TransactionApi } from "./api/api";
import { Transaction } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { QueryParams, BalanceInfo } from "./model/models";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";

@Injectable()
export class TransactionsService {
    constructor(private api: TransactionApi) {

    }

    batchUpdate(transactions: Transaction[], idToDelete?: number[]): Observable<Transaction[]> {
        return decorateCommonCatch(this.api.batchSave({
            delete: idToDelete || [],
            save: transactions
        }));
    }

    fetch(query: QueryParams): Observable<Transaction[]> {
        return decorateCommonCatch(this.api.getAll(query.search, query.skip, query.take, query.sorting));
    }

    balanceInfo(year: number, month: number): Observable<BalanceInfo> {
        return decorateCommonCatch(this.api.balanceInfo(year, month));
    }
}