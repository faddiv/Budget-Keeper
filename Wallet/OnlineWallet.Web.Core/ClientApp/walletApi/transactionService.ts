import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { Transaction, QueryParams, BalanceInfo } from "./model";
import { buildUrl } from "./linkHelpers";

const urlBase = "/api/v1/Transaction";

class TransactionService {

    private async fetch(query?: QueryParams): Promise<Transaction[]> {

        const url = buildUrl(urlBase, walletApiConfig.baseUrl, query);

        const response = await fetch(url.toString());
        const result = await ThenJson<Transaction[]>(response);
        return result;
    }

    fetchDateRange(start: string, end: string) {
        return this.fetch({
            search: `CreatedAt >= "${start}" And CreatedAt <= "${end}"`,
            sorting: "CreatedAt desc, Name asc, TransactionId desc"
        });
    }

    fetchArticle(name: string, limit: number = 20) {
        return this.fetch({
            search: `Name = "${name}"`,
            sorting: "CreatedAt desc, Name asc, TransactionId desc",
            take: limit
        });
    }

    async batchUpdate(transactions: Transaction[], idToDelete?: number[]): Promise<Transaction[]> {

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
        const result = await ThenJson<Transaction[]>(response);
        return result;
    }

    async balanceInfo(year: number, month: number): Promise<BalanceInfo> {
        const url = buildUrl(urlBase + "/BalanceInfo", walletApiConfig.baseUrl, { year, month });

        const response = await fetch(url.toString());
        const result = await ThenJson<BalanceInfo>(response);
        return result;
    }

}

export const transactionService = new TransactionService();
