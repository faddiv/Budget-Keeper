import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TransactionViewModel, ITransactionTableExtFunction } from '../models';
import { Wallet, Transaction, WalletService } from 'walletApi';
import { ListHelpers } from 'walletCommon';

@Component({
  moduleId: `${module.id}`,
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css']
})
export class TransactionTableComponent implements OnInit, OnChanges {

  wallets: Wallet[];

  pageItems: TransactionViewModel[];

  @Input("items")
  items: Transaction[];

  @Input("changedItems")
  changedItems: Transaction[];

  @Input("rowModifier")
  rowModifier: ITransactionTableExtFunction;

  @Output()
  deleted = new EventEmitter<TransactionViewModel>();

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.walletService.getAll().subscribe(value => {
      this.wallets = value;
      if (this.pageItems && this.pageItems.length) {
        this.pageItems.forEach(item => this.setWalletName(item));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["items"]) {
      this.loadItems();
    }
  }

  loadItems() {
    this.pageItems = this.items ? this.items.map(v => new TransactionViewModel(v)) : [];

    this.pageItems.forEach(item => {
      this.setWalletName(item); 
      if (this.rowModifier) {
        this.rowModifier(item);
      }
    });
  }

  editTransaction(item: TransactionViewModel) {
    item.editMode = !item.editMode;
  }

  deleteTransaction(item: TransactionViewModel) {
    ListHelpers.remove(this.items, item.original);
    this.deleted.emit(item);
  }

  saveTransaction(item: TransactionViewModel) {
    for (var key in item.original) {
      if (item.original.hasOwnProperty(key)) {
          if ((<any>item.original)[key] !== (<any>item)[key]) {
            (<any>item.original)[key] = (<any>item)[key];
            item.changed = true;
          }
      }
    }
    this.setWalletName(item);
    item.editMode = false;
    if (this.changedItems) {
      var changes = this.pageItems.filter(val => val.changed);
      for (var index = 0; index < changes.length; index++) {
        var item = changes[index];
        if (this.changedItems.findIndex(e => e === item.original) === -1) {
          this.changedItems.push(item.original);
        }
      }
    }
  }
  private setWalletName(item: TransactionViewModel) {
    item.walletName = ListHelpers.selectMap(this.wallets, w => w.moneyWalletId == item.walletId, w => w.name) || "";
  }
}
