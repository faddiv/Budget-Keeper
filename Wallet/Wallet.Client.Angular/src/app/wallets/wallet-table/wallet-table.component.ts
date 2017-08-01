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

  @Output("edit")
  edit = new EventEmitter<Wallet>();

  @Output("delete")
  delete = new EventEmitter<Wallet>();

  constructor() { }

  ngOnInit() {
  }

  onEditBtnClicked(wallet: Wallet) {
    this.edit.emit(wallet);
  }

  onDeleteBtnClicked(wallet: Wallet) {
    this.delete.emit(wallet);
  }
}
