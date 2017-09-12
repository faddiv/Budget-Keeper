import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MoneyOperation, ExportImportRow, WalletService, Wallet, ApiError } from "walletApi";
import { ListHelpers } from 'walletCommon';
import { IDirtyForm } from 'app/common/ask-if-form-dirty-service.service';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, IDirtyForm {
  linesToSave: MoneyOperation[];
  wallets: Wallet[] = [];

  constructor(private walletService: WalletService) {

  }

  startNew() {
    this.linesToSave = [];
  }

  ngOnInit() {
    this.walletService.getAll({
      search: ""
    }).subscribe(value => {
      this.wallets = value;
    }, (error: ApiError) => {
      console.error(error.message);
    });
    this.startNew();
  }

  addLine(newItem: MoneyOperation) {
    this.linesToSave.push(newItem);
  }

  onDeleteBtnClicked(item: MoneyOperation) {
    ListHelpers.remove(this.linesToSave, item);
  }

  walletNameById(walletId: number) {
    return this.wallets.filter(wallet => wallet.moneyWalletId == walletId).map(wallet => wallet.name)[0];
  }

  isDirtyForm() {
    return this.linesToSave.length;
  }
}
