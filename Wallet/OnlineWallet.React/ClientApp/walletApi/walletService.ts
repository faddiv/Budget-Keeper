import { walletApiConfig } from "./walletApiConfig";
import { Wallet } from "./model/models";
import { buildUrl } from "./linkHelpers";

class WalletService {
    public getAll(): Promise<Wallet[]> {
        var url = buildUrl("/api/v1/Wallet", walletApiConfig.baseUrl);
        return fetch(url.toString())
            .then(response => {
                return <Promise<Wallet[]>>response.json();
            });
    }
}

export var walletService = new WalletService();

