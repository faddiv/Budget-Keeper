import { ArticleModel } from "./model";
import { ThenJson, jsonRequestInit, buildUrl } from "../helpers";

const urlBase = "/api/v1/Article";

class ArticleService {

    async filterBy(search: string, limit?: number): Promise<ArticleModel[]> {
        const url = buildUrl([urlBase], {
            search,
            limit
        });
        const response = await fetch(url.toString());
        const result = await ThenJson<ArticleModel[]>(response);
        return result;
    }

    async syncFromTransactions(articles?: string[]): Promise<boolean> {
        const url = buildUrl([urlBase, "/SyncFromTransactions"]);
        const response = await fetch(url.toString(), jsonRequestInit({
            articles
        }, "POST"));
        return response.ok;
    }
}

export const articleService = new ArticleService();
