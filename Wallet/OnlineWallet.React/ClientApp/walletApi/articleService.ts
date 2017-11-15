import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { ArticleModel } from "./model/models";
import { buildUrl } from "./linkHelpers";

const urlBase = "/api/v1/Article";

class ArticleService {

    async filterBy(search: string, limit?: number): Promise<ArticleModel[]> {
        var url = buildUrl(urlBase, walletApiConfig.baseUrl, {
            search,
            limit
        });
        const response = await fetch(url.toString());
        const result = await ThenJson<ArticleModel[]>(response);
        return result;
    }
}

export var articleService = new ArticleService();