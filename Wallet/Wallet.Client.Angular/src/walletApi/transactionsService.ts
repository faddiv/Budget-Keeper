import { MoneyOperationApi } from "./api/api";
import { MoneyOperation } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { QueryParams } from "./queryParams";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";

@Injectable()
export class TrasactionsService {
    constructor(private api: MoneyOperationApi) {

    }

    batchUpdate(transactions: MoneyOperation[]): Observable<MoneyOperation[]> {
        return decorateCommonCatch(this.api.batchSave(transactions));
    }
}