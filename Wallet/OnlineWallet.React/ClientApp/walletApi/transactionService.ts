import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { Transaction, QueryParams } from "./model/models";
import { buildUrl } from "./linkHelpers";

class TransactionService {
    async fetch(query?: QueryParams): Promise<Transaction[]> {

        var url = buildUrl("/api/v1/Transaction", walletApiConfig.baseUrl, query);

        const response = await fetch(url.toString());
        return ThenJson<Transaction[]>(response);
    }
}

export var transactionService = new TransactionService();
