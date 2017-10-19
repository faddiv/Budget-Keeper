import {ArticleApi } from "./api/api";
import { ArticleModel } from "./model/models";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ApiError } from "./apiError";
import { decorateCommonCatch } from "./serviceHelpers";

@Injectable()
export class ArticleService {
    constructor(private api: ArticleApi) {

    }

    filterBy(search: string, limit?: number): Observable<ArticleModel[]> {
        return decorateCommonCatch(this.api.getBy(search, limit));
    }
}