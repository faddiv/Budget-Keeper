import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { Transaction } from "./model";
import { buildUrl } from "./linkHelpers";

const urlBase = "/api/v1/Transaction";

class TransactionService {

    async fetchDateRange(start: string, end: string) {
        const url = buildUrl(urlBase + "/FetchByDateRange", walletApiConfig.baseUrl, { start, end });

        const response = await fetch(url.toString());
        const result = await ThenJson<Transaction[]>(response);
        return result;
    }

    async fetchArticle(article: string, limit: number = 10, skip: number = 0) {
        const url = buildUrl(urlBase + "/FetchByArticle", walletApiConfig.baseUrl, { article, limit, skip });

        const response = await fetch(url.toString());
        const result = await ThenJson<Transaction[]>(response);
        return result;
    }

    async batchUpdate(transactions: Transaction[], idToDelete?: number[]): Promise<boolean> {

        transactions = transactions || [];
        idToDelete = idToDelete || [];
        transactions.forEach(tr => {
            if (!tr.transactionId) {
                delete tr.transactionId;
            }
        });

        const url = buildUrl(urlBase + "/BatchSave", walletApiConfig.baseUrl);

        const response = await fetch(url.toString(), walletApiConfig.jsonRequestConfig({
            save: transactions,
            delete: idToDelete
        }, "POST"));
        return response.ok;
    }

}

export const transactionService = new TransactionService();
