import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { Transaction, QueryParams, BalanceInfo } from "./model/models";
import { buildUrl } from "./linkHelpers";

const urlBase = "/api/v1/Transaction";

class TransactionService {
    async fetch(query?: QueryParams): Promise<Transaction[]> {

        var url = buildUrl(urlBase, walletApiConfig.baseUrl, query);

        const response = await fetch(url.toString());
        const result = await ThenJson<Transaction[]>(response);
        return result;
    }

    async batchUpdate(transactions: Transaction[], idToDelete?: number[]): Promise<Transaction[]> {
        
        var url = buildUrl(urlBase+"/BatchSave", walletApiConfig.baseUrl);
        
        const response = await fetch(url.toString(), walletApiConfig.jsonRequestConfig({
            save: transactions,
            delete: idToDelete
        }, "POST"));
        const result = await ThenJson<Transaction[]>(response);
        return result;
    }

    async balanceInfo(year: number, month: number): Promise<BalanceInfo> {
        var url = buildUrl(urlBase+"/BalanceInfo", walletApiConfig.baseUrl, { year, month });
        
        const response = await fetch(url.toString());
        const result = await ThenJson<BalanceInfo>(response);
        return result;
    } 
}

export var transactionService = new TransactionService();
