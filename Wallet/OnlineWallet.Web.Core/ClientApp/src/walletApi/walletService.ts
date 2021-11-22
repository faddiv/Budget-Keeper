import { Wallet } from "./model";
import { ThenJson, jsonRequestInit, buildUrl } from "../helpers";

class WalletService {
  methodUrl = "/api/v1/Wallet";
  cache: Wallet[] | null = null;

  async getAll(): Promise<Wallet[]> {
    if (this.cache) {
      return Promise.resolve(this.cache);
    }
    const url = buildUrl([this.methodUrl]);
    const response = await fetch(url.toString());
    const wallets = await ThenJson<Wallet[]>(response);
    this.cache = wallets;
    return wallets;
  }

  async update(wallet: Wallet): Promise<Wallet> {
    this.cache = null;
    if (!wallet.moneyWalletId) {
      return Promise.resolve(wallet);
    }
    const url = buildUrl([this.methodUrl, wallet.moneyWalletId.toString()]);
    const response = await fetch(url.toString(), jsonRequestInit(wallet, "PUT"));
    return ThenJson<Wallet>(response);
  }

  async insert(wallet: Wallet): Promise<Wallet> {
    this.cache = null;
    const url = buildUrl([this.methodUrl]);
    const response = await fetch(url.toString(), jsonRequestInit(wallet, "POST"));
    return ThenJson<Wallet>(response);
  }

  async delete(wallet: Wallet): Promise<Response> {
    this.cache = null;
    if (!wallet.moneyWalletId) {
      return Promise.resolve(undefined as any);
    }
    const url = buildUrl([this.methodUrl, wallet.moneyWalletId.toString()]);
    const response = await fetch(url.toString(), jsonRequestInit(undefined, "DELETE"));
    if (!response.ok) {
      const body = await response.text();
      throw Error(body);
    }
    return response;
  }
}

export let walletService = new WalletService();
