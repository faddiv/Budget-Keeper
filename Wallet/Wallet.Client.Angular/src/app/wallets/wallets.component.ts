import { Component, OnInit } from "@angular/core";
import { Wallet, WalletService, ApiError } from "walletApi";
import { Observable } from "rxjs/Observable";

@Component({
  moduleId: `${module.id}`,
  selector: "app-wallets",
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  wallets: Wallet[] = [];
  edited: Wallet;
  loading: boolean = false;

  constructor(private walletService: WalletService) {
  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.wallets = [];
    this.loading = true;
    this.walletService.getAll()
      .subscribe(value => {
        this.wallets = value;
        this.loading = false;
      }, (error: ApiError) => {
        console.error(error.message);
        this.loading = false;
      });
  }

  public insert(wallet: Wallet) {
    this.edited = null;
    this.walletService.insert(wallet)
      .subscribe(result => {
        this.updateOrInsertListItem(result);
      });

  }

  public update(wallet: Wallet) {
    this.walletService.update(wallet)
      .subscribe(result => {
        this.updateOrInsertListItem(result);
        this.edited = null;
      });

  }

  public delete(wallet: Wallet) {
    this.walletService.delete(wallet)
      .subscribe(result => {
        var  index = this.getElementIndex(wallet);
        this.wallets.splice(index, 1);
      });
  }

  private updateOrInsertListItem(wallet: Wallet) {
    var index = this.getElementIndex(wallet);
    if (index === -1) {
      this.wallets.push(wallet);
    } else {
      this.wallets[index] = wallet;
    }
  }

  private getElementIndex(wallet: Wallet) {
    for (var index = 0; index < this.wallets.length; index++) {
      if (this.wallets[index].moneyWalletId == wallet.moneyWalletId) {
        return index
      }
    }
    return -1;
  }
}
