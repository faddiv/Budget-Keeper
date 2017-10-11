import { ExportImportRow } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";
import { ResponseContentType } from "@angular/http";
import { BASE_PATH } from "./variables";

var apiPath = "/api/v1/Export"

@Injectable()
export class ExportService {

    basePath: string;
    constructor( @Inject(BASE_PATH) basePath: string) {
        this.basePath = basePath;
    }

    exportRange(from: string, to: string, fileName: string): void {
        location.href = this.basePath + apiPath + "?from=" + from + "&to=" + to + "&fileName=" + fileName;
    }
}