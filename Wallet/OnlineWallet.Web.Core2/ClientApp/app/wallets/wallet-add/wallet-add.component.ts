import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Wallet } from "walletApi";
import { WalletViewModel } from 'app/wallets/WalletViewModel';

@Component({
  moduleId: `${module.id}`,
  selector: 'app-wallet-add',
  templateUrl: './wallet-add.component.html'
})
export class WalletAddComponent implements OnInit {

  @Output()
  save = new EventEmitter<WalletViewModel>();
  name: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit($event: Event) {
    $event.preventDefault();
    this.save.emit(new WalletViewModel({
      name: this.name
    }));
    this.name = "";
  }
}
