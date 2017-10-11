import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { WalletViewModel } from 'app/wallets/WalletViewModel';

@Component({
  moduleId: module.id,
  selector: 'app-wallet-table',
  templateUrl: './wallet-table.component.html'
})
export class WalletTableComponent implements OnInit {

  @Input("wallets")
  wallets: WalletViewModel[];

  @Output("save")
  save = new EventEmitter<WalletViewModel>();

  @Output("delete")
  delete = new EventEmitter<WalletViewModel>();

  @Input("edited")
  edited: WalletViewModel;

  @Output("editedChange")
  editedChange = new EventEmitter<WalletViewModel>();

  constructor() { }

  ngOnInit() {
    /*this.save.subscribe(result => {
      console.log("save success:", result);
      result.name = this.selected.name;
      this.selected = null;
    });*/
  }

  onEditBtnClicked(wallet: WalletViewModel) {
    this.setEdited({ ...wallet });
  }

  onDeleteBtnClicked(wallet: WalletViewModel) {
    this.delete.emit(wallet);
  }

  onSaveBtnClicked(wallet: WalletViewModel, $event: Event) {
    $event.preventDefault();
    this.save.emit(wallet);
  }

  onCancelBtnClicked(wallet: WalletViewModel) {
    this.setEdited(null);
  }

  inEditMode(wallet: WalletViewModel) {
    return this.edited && this.edited.moneyWalletId === wallet.moneyWalletId;
  }

  private setEdited(wallet: WalletViewModel) {
    this.edited = wallet;
    this.editedChange.emit(wallet);
  }
}
