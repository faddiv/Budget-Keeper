import { Wallet } from "./model/models";

var baseUrl = "http://localhost:56491";

class WalletService {
    public getAll(): Promise<Wallet[]> {
        return fetch(new URL("/api/v1/Wallet", baseUrl).toString())
            .then(response => {
                return <Promise<Wallet[]>>response.json();
            });
    }
}

export var walletService = new WalletService();

