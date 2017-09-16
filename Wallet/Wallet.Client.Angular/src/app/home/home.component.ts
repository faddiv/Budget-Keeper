import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MoneyOperation, ExportImportRow, WalletService, Wallet, ApiError } from "walletApi";
import { ListHelpers } from 'walletCommon';
import { ICleanForm } from 'app/common/ask-if-form-dirty.service';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, ICleanForm {
  linesToSave: MoneyOperation[];
  wallets: Wallet[] = [];

  constructor(private walletService: WalletService) {

  }

  startNew() {
    this.linesToSave = [];
  }

  ngOnInit() {
    this.startNew();
    this.walletService.getAll({
      search: ""
    }).subscribe(value => {
      this.wallets = value;
    }, (error: ApiError) => {
      console.error(error.message);
    });
  }

  addLine(newItem: MoneyOperation) {
    this.linesToSave.push(newItem);
  }

  saveAll() {
    if(!this.linesToSave.length) {
      alert("Nothing to save");
      return;
    }
    alert("save");
    this.startNew();
  }

  onDeleteBtnClicked(item: MoneyOperation) {
    ListHelpers.remove(this.linesToSave, item);
  }

  walletNameById(walletId: number) {
    return this.wallets.filter(wallet => wallet.moneyWalletId == walletId).map(wallet => wallet.name)[0];
  }

  @HostListener('window:beforeunload')
  isCleanForm() {
    return !this.linesToSave.length;
  }
}
