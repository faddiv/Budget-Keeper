import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Transaction, WalletService, Wallet, ApiError } from "walletApi";
import { ListHelpers } from 'walletCommon';
import { ICleanForm } from 'app/common/ask-if-form-dirty.service';
import { TransactionsService } from 'walletApi';
import { AlertsService } from 'app/common/alerts';
import { TransactionViewModel, directionColoringFunction } from 'app/common/transaction-view';
import { AddTransactionComponent } from 'app/home/add-transaction/add-transaction.component';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, ICleanForm {
  
  linesToSave: Transaction[];
  wallets: Wallet[] = [];
  rowColoring = directionColoringFunction;

  @ViewChild(AddTransactionComponent)
  addTransaction: AddTransactionComponent;

  constructor(
    private walletService: WalletService,
    private transactionsService: TransactionsService,
    private alertsService: AlertsService) {

  }

  startNew() {
    this.linesToSave = [];
  }

  ngOnInit() {
    this.startNew();
    this.walletService.getAll().subscribe(value => {
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
      this.addTransaction.clearFields();
    }, error => {
      this.alertsService.error(error.message);
    })
  }

  delete(item: TransactionViewModel) {
    this.linesToSave = ListHelpers.remove(this.linesToSave, item.original);
  }

  walletNameById(walletId: number) {
    return ListHelpers.selectMap(this.wallets,
      wallet => wallet.moneyWalletId == walletId,
      wallet => wallet.name);
  }

  @HostListener('window:beforeunload')
  isCleanForm() {
    return !this.linesToSave.length;
  }
}
