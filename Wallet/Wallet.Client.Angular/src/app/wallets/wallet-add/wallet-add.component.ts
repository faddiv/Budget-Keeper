import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Wallet } from "walletApi";

@Component({
  selector: 'app-wallet-add',
  templateUrl: './wallet-add.component.html',
  styleUrls: ['./wallet-add.component.scss']
})
export class WalletAddComponent implements OnInit {

  @Output()
  save = new EventEmitter<Wallet>();
  name: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit($event: Event) {
    $event.preventDefault();
    this.save.emit({
      name: this.name
    });
    this.name = "";
  }
}
