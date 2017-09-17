import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MoneyOperation, ExportImportRow, WalletService, Wallet, ApiError } from "walletApi";
import { ListHelpers } from 'walletCommon';
import { ICleanForm } from 'app/common/ask-if-form-dirty.service';
import { TrasactionsService } from 'walletApi';
import { AlertModel } from 'app/common/alerts/AlertModel';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, ICleanForm {
  linesToSave: MoneyOperation[];
  wallets: Wallet[] = [];
  alerts: AlertModel[] = [];

  constructor(
    private walletService: WalletService,
    private transactionsService: TrasactionsService) {

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
      this.alerts.push(AlertModel.error(error.message));
    });
  }

  addLine(newItem: MoneyOperation) {
    this.linesToSave.push(newItem);
  }

  saveAll() {
    if (!this.linesToSave.length) {
      this.alerts.push(AlertModel.warning("Nothing to save"));
      return;
    }
    this.transactionsService.batchUpdate(this.linesToSave).subscribe(result => {
      
      this.alerts.push(AlertModel.success("Transactions are saved successfully."));
      this.startNew();
    }, error => {
      this.alerts.push(AlertModel.error(error.message));
    })
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
