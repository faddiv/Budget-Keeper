import { ImportApi } from "./api/api";
import { ExportImportRow } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";

@Injectable()
export class ImportService {
    constructor(private api: ImportApi) {

    }

    uploadTransactions(file: File): Observable<ExportImportRow[]> {
        return decorateCommonCatch(this.api.processTransactions(file));
    }
}