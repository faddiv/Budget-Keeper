import { Component, OnInit } from '@angular/core';
import { Wallet, WalletApi } from "walletApi";
@Component({
  moduleId: `${module.id}`,
  selector: "app-wallets",
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {

  wallets: Wallet[];

  constructor(private walletApi: WalletApi) {
    this.wallets = [];
  }

  ngOnInit() {
    this.walletApi.apiV1WalletGet()
      .subscribe(value => {
        this.wallets = value;
      })
  }

  edit(wallet: Wallet) {
    alert("Edit: "+JSON.stringify(wallet));
  }

  delete(wallet: Wallet) {
    alert("Delete: "+JSON.stringify(wallet));
  }
}
