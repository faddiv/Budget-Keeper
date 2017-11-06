import { walletApiConfig } from "./walletApiConfig";
import { Transaction, QueryParams } from "./model/models";
import { buildUrl } from "./linkHelpers";

class TransactionService {
    public fetch(query?: QueryParams): Promise<Transaction[]> {
        
        var url = buildUrl("/api/v1/Transaction", walletApiConfig.baseUrl, query);

        return fetch(url.toString(), {
            method: "GET",
            mode: "cors"
        }).then(response => {
            return <Promise<Transaction[]>>response.json();
        });
    }
}

export var transactionService = new TransactionService();
