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

}
