import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { ArticleModel } from "./model";
import { buildUrl } from "./linkHelpers";

const urlBase = "/api/v1/Article";

class ArticleService {

    async filterBy(search: string, limit?: number): Promise<ArticleModel[]> {
        const url = buildUrl(urlBase, walletApiConfig.baseUrl, {
            search,
            limit
        });
        const response = await fetch(url.toString());
        const result = await ThenJson<ArticleModel[]>(response);
        return result;
    }

    async syncFromTransactions(articles?: string[]): Promise<boolean> {
        const url = buildUrl(urlBase + "/SyncFromTransactions", walletApiConfig.baseUrl);
        const response = await fetch(url.toString(), walletApiConfig.jsonRequestConfig({
            articles
        }, "POST"));
        return response.ok;
    }
}

export const articleService = new ArticleService();
