import { Component, OnInit } from "@angular/core";
import { Wallet, WalletService, ApiError } from "walletApi";
import { ListHelpers } from "walletCommon";
import { Observable } from "rxjs/Observable";
import { WalletViewModel } from "./WalletViewModel";

@Component({
  moduleId: module.id.toString(),
  selector: "app-wallets",
  templateUrl: './wallets.component.html'
})
export class WalletsComponent implements OnInit {

  wallets: WalletViewModel[] = [];
  edited: Wallet;
  loading: boolean = false;

  constructor(private walletService: WalletService) {
  }

  ngOnInit() {
    this.reload();
  }

  reload(searchText?: string) {
    this.wallets = [];
    this.loading = true;
    this.walletService.searchBy({
      search: searchText
    }).map(walletList => {
      return walletList.map(item => new WalletViewModel(item));
    }).subscribe(value => {
      this.wallets = value;
      this.loading = false;
    }, (error: ApiError) => {
      console.error(error.message);
      this.loading = false;
    });
  }

  public search() {

  }

  public insert(wallet: WalletViewModel) {
    this.edited = null;
    this.walletService.insert(wallet).map(walletEntity => {
      return new WalletViewModel(walletEntity);
    }).subscribe(result => {
      this.updateOrInsertListItem(result);
    });

  }

  public update(wallet: Wallet) {
    this.walletService.update(wallet).map(walletEntity => {
      return new WalletViewModel(walletEntity);
    }).subscribe(result => {
      this.updateOrInsertListItem(result);
      this.edited = null;
    });

  }

  public delete(wallet: WalletViewModel) {
    this.walletService.delete(wallet)
      .subscribe(result => {
        this.wallets = ListHelpers.remove(this.wallets, wallet);
      });
  }

  private updateOrInsertListItem(wallet: WalletViewModel) {
    const index = this.wallets.findIndex(w => w.moneyWalletId === wallet.moneyWalletId);
    if (index === -1) {
      this.wallets.push(wallet);
    } else {
      this.wallets[index] = wallet;
    }
  }
}
