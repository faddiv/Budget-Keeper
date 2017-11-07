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

    public update(wallet: Wallet): Promise<Wallet> {
        var url = buildUrl("/api/v1/Wallet/" + wallet.moneyWalletId, walletApiConfig.baseUrl);
        return fetch(url.toString(), {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type":"text/json;charset=UTF-8"
            },
            body: JSON.stringify(wallet)
        })
            .then(response => {
                return <Promise<Wallet>>response.json();
            });
    }

}

export var walletService = new WalletService();

