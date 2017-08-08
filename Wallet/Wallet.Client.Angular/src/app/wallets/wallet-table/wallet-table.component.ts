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

  @Output("save")
  save = new EventEmitter<Wallet>();

  @Output("delete")
  delete = new EventEmitter<Wallet>();

  @Input("edited")
  edited: Wallet;

  @Output("editedChange")
  editedChange = new EventEmitter<Wallet>();

  constructor() { }

  ngOnInit() {
    /*this.save.subscribe(result => {
      console.log("save success:", result);
      result.name = this.selected.name;
      this.selected = null;
    });*/
  }

  onEditBtnClicked(wallet: Wallet) {
    this.setEdited({ ...wallet });
  }

  onDeleteBtnClicked(wallet: Wallet) {
    this.delete.emit(wallet);
  }

  onSaveBtnClicked(wallet: Wallet, $event: Event) {
    $event.preventDefault();
    this.save.emit(wallet);
  }

  onCancelBtnClicked(wallet: Wallet) {
    this.setEdited(null);
  }

  inEditMode(wallet: Wallet) {
    return this.edited && this.edited.moneyWalletId === wallet.moneyWalletId;
  }

  private setEdited(wallet: Wallet) {
    this.edited = wallet;
    this.editedChange.emit(wallet);
  }
}
