import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Transaction, ExportImportRow, WalletService, Wallet, ApiError } from "walletApi";
import { ListHelpers } from 'walletCommon';
import { ICleanForm } from 'app/common/ask-if-form-dirty.service';
import { TrasactionsService } from 'walletApi';
import { AlertModel } from 'app/common/alerts/AlertModel';
import { AlertsService } from 'app/common/alerts';
import { TransactionViewModel, directionColoringFunction } from 'app/common/transaction-view';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, ICleanForm {
  linesToSave: Transaction[];
  wallets: Wallet[] = [];
  rowColoring = directionColoringFunction;

  constructor(
    private walletService: WalletService,
    private transactionsService: TrasactionsService,
    private alertsService: AlertsService) {

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
      this.alertsService.error(error.message);
    });
  }

  addLine(newItem: Transaction) {
    this.linesToSave = this.linesToSave.concat(newItem);
  }

  saveAll() {
    this.alertsService.dismissAll();
    if (!this.linesToSave.length) {
      this.alertsService.warning("Nothing to save");
      return;
    }
    this.transactionsService.batchUpdate(this.linesToSave).subscribe(result => {
      
      this.alertsService.success("Transactions are saved successfully.");
      this.startNew();
    }, error => {
      this.alertsService.error(error.message);
    })
  }

  onDeleteBtnClicked(item: Transaction) {
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
