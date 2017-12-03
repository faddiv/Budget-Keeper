import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Transaction, Wallet, WalletService } from 'walletApi';
import { TransactionViewModel, ITransactionTableExtFunction } from '../models';
import { ListHelpers } from 'walletCommon';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-paged-transaction-table',
  templateUrl: './paged-transaction-table.component.html'
})
export class PagedTransactionTableComponent implements OnInit, OnChanges {

  @Input("items")
  items: Transaction[];

  @Input("changedItems")
  changedItems: Transaction[];

  @Input("rowColoring")
  rowColoring: ITransactionTableExtFunction;

  wallets: Wallet[];

  pageItems: Transaction[];

  pages: number[];

  page: number;

  pageSize = 10;

  pageCount: number;

  constructor(private walletService: WalletService) {

  }

  get hasElements() {
    return this.pageItems && this.pageItems.length;
  }

  ngOnInit() {
    this.walletService.getAll().subscribe(value => {
      this.wallets = value;
      if (this.pageItems.length) {
        this.select(this.page);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["items"]) {
      this.select(1);
    }
  }

  select(pageNumber: number) {
    const pageSize = this.pageSize;
    const items = this.items;

    if (pageSize === 0 || !items || !items.length) {
      this.pageCount = 1;
    } else {
      this.pageCount = Math.ceil(items.length / pageSize);
    }
    if (pageNumber > this.pageCount) {
      pageNumber = this.pageCount;
    }
    this.page = pageNumber;
    const from = this.showItemsFrom();
    const to = this.showItemsTo();
    this.pageItems = this.items ? this.items.slice(from, to) : [];
    const pages: number[] = [];
    const pagesFrom = Math.max(pageNumber - 5, 1);
    const pagesTo = Math.min(pagesFrom + 10, this.pageCount + 1);
    for (let index = pagesFrom; index < pagesTo; index++) {
      pages.push(index);
    }
    this.pages = pages;
  }

  editTransaction(item: TransactionViewModel) {
    item.editMode = !item.editMode;
  }

  transactionDeleted(item: TransactionViewModel) {
    ListHelpers.remove(this.items, item.original);
    this.select(this.page);
  }

  first() {
    this.select(1);
  }

  last() {
    this.select(this.pageCount);
  }

  showItemsFrom(): number {
    if (!this.items || !this.items.length) { return 0; }
    return Math.min((this.page - 1) * this.pageSize, this.items.length);
  }

  showItemsTo(): number {
    if (!this.items || !this.items.length) { return 0; }
    return Math.min(this.page * this.pageSize, this.items.length);
  }
}
