import { walletApiConfig, ThenJsonGenerator, ThenJson } from "./walletApiConfig";
import { Wallet } from "./model/models";
import { buildUrl } from "./linkHelpers";

class WalletService {
    methodUrl = "/api/v1/Wallet";
    cache: Wallet[];

    async getAll(): Promise<Wallet[]> {
        if (this.cache) {
            return Promise.resolve(this.cache);
        }
        var url = buildUrl(this.methodUrl, walletApiConfig.baseUrl);
        const response = await fetch(url.toString());
        const wallets = await ThenJson<Wallet[]>(response);
        this.cache = wallets;
        return wallets;
    }

    async update(wallet: Wallet): Promise<Wallet> {
        this.cache = null;
        var url = buildUrl(this.methodUrl + "/" + wallet.moneyWalletId, walletApiConfig.baseUrl);
        const response = await fetch(url.toString(), walletApiConfig.jsonRequestConfig(wallet, "PUT"));
        return ThenJson<Wallet>(response);
    }

    async insert(wallet: Wallet): Promise<Wallet> {
        this.cache = null;
        var url = buildUrl(this.methodUrl, walletApiConfig.baseUrl);
        var response = await fetch(url.toString(), walletApiConfig.jsonRequestConfig(wallet, "POST"));
        return ThenJson<Wallet>(response);
    }

    async delete(wallet: Wallet): Promise<Response> {
        this.cache = null;
        var url = buildUrl(this.methodUrl + "/" + wallet.moneyWalletId, walletApiConfig.baseUrl);
        var response = await fetch(url.toString(), walletApiConfig.jsonRequestConfig(undefined, "DELETE"));
        if (!response.ok) {
            const body = await response.text();
            throw Error(body);
        }
        return response;
    }

}

export var walletService = new WalletService();

