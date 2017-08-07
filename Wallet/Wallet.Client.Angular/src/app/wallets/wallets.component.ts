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

  public save(wallet: Wallet) {
    this.walletService.update(this.edited)
      .subscribe(result => {
        this.updateListItem(this.edited);
        this.edited = null;
      });

  }

  public delete(wallet: Wallet) {
    console.log("Delete:", wallet);
  }

  private updateListItem(wallet: Wallet) {
    for (var index = 0; index < this.wallets.length; index++) {
      if (this.wallets[index].moneyWalletId == wallet.moneyWalletId) {
        this.wallets[index] = wallet;
        return;
      }
    }
    console.error("Wallet not found item:", wallet, "List:", this.wallets);
  }
}
