import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Transaction, Wallet, WalletService } from 'walletApi';
import { TransactionViewModel } from '../models/TransactionViewModel';

@Component({
  selector: 'app-paged-transaction-table',
  templateUrl: './paged-transaction-table.component.html',
  styleUrls: ['./paged-transaction-table.component.scss']
})
export class TransactionTableComponent implements OnInit, OnChanges {

  @Input("items")
  items: Transaction[];

  @Input("coloring")
  coloring: boolean;

  wallets: Wallet[];

  pageItems: TransactionViewModel[];

  pages: number[];

  page: number;

  pageSize: number = 10;

  pageCount: number;

  constructor(private walletService: WalletService) {

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
    var pageSize = this.pageSize,
      items = this.items;

    if (pageSize === 0 || !items || !items.length) {
      this.pageCount = 1;
    } else {
      this.pageCount = Math.floor(items.length / pageSize);
    }
    if (pageNumber > this.pageCount) {
      pageNumber == this.pageCount
    }
    this.page = pageNumber;
    var from = this.showItemsFrom();
    var to = this.showItemsTo();
    this.pageItems = this.items ? this.items.slice(from, to).map(v => new TransactionViewModel(v, this.wallets)) : [];
    if(this.coloring) {
      this.pageItems.forEach(defaultColoringFunction);
    }
    var pages: number[] = [];
    var pagesFrom = Math.max(pageNumber - 5, 1);
    var pagesTo = Math.min(pagesFrom + 10, this.pageCount + 1);
    for (var index = pagesFrom; index < pagesTo; index++) {
      pages.push(index);
    }
    this.pages = pages;
  }

  first() {
    this.select(1);
  }

  last() {
    this.select(this.pageCount);
  }

  showItemsFrom(): number {
    if (!this.items || !this.items.length)
      return 0;
    return Math.min((this.page - 1) * this.pageSize, this.items.length);
  }

  showItemsTo(): number {
    if (!this.items || !this.items.length)
      return 0;
    return Math.min(this.page * this.pageSize, this.items.length);
  }
}

function defaultColoringFunction(value:TransactionViewModel) {
  value.cssClass = value.transactionId ? "info" : undefined;
}