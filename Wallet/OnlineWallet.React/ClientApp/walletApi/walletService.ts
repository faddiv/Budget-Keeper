var baseUrl = "http://localhost:56491";

class WalletService {
    public getAll(): Promise<Wallet[]> {
        return fetch(new URL("/api/v1/Wallet", baseUrl).toString())
            .then(response => {
                return <Promise<Wallet[]>>response.json();
            });
    }
}

export interface Wallet {
    moneyWalletId?: number;

    name?: string;

}

export var walletService = new WalletService();

