import { Transaction } from "./model";
import { ThenJson, jsonRequestInit, buildUrl } from "../helpers";

const urlBase = "/api/v1/Transaction";

class TransactionService {

    async fetchDateRange(start: string, end: string) {
        const url = buildUrl([urlBase, "/FetchByDateRange"], { start, end });

        const response = await fetch(url.toString());
        const result = await ThenJson<Transaction[]>(response);
        return result;
    }

    async fetchCategory(category: string, args: { start?: string, end?: string, limit?: number, skip?: number } = {}) {
        const url = buildUrl([urlBase, "/FetchByCategory"],
            {
                start: args.start,
                end: args.end,
                limit: args.limit,
                skip: args.skip,
                category
            });

        const response = await fetch(url.toString());
        const result = await ThenJson<Transaction[]>(response);
        return result;
    }

    async fetchArticle(article: string, limit: number = 10, skip: number = 0) {
        const url = buildUrl([urlBase, "/FetchByArticle"], { article, limit, skip });

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

        const url = buildUrl([urlBase, "/BatchSave"]);

        const response = await fetch(url.toString(), jsonRequestInit({
            save: transactions,
            delete: idToDelete
        }, "POST"));
        if (response.ok) {
            return true;
        } else {
            throw Error(response.statusText);
        }
    }

}

export const transactionService = new TransactionService();
