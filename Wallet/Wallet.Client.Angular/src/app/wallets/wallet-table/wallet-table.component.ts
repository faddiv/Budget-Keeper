import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Wallet } from "walletApi";

@Component({
  moduleId: `${module.id}`,
  selector: 'app-wallet-table',
  templateUrl: './wallet-table.component.html',
  styleUrls: ['./wallet-table.component.scss']
})
export class WalletTableComponent implements OnInit {

  @Input("wallets")
  wallets: Wallet[];

  selected: Wallet;

  constructor() { }

  ngOnInit() {
  }

  onEditBtnClicked(wallet: Wallet) {
    this.selected = {...wallet};
  }

  onDeleteBtnClicked(wallet: Wallet) {
    
  }

  onSaveBtnClicked(wallet: Wallet) {
    wallet.name = this.selected.name;
    this.selected = null;
  }

  onCancelBtnClicked(wallet: Wallet) {
    this.selected = null;
  }

  isSelected(wallet: Wallet) {
    return this.selected && this.selected.moneyWalletId === wallet.moneyWalletId;
  }
}
