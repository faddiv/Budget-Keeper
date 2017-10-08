import { Component, OnInit } from '@angular/core';
import { Transaction, TrasactionsService } from 'walletApi';
import { AlertsService } from 'app/common/alerts';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[];
  changedItems: Transaction[] = [];

  constructor(
    private trasactionsService: TrasactionsService,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {
    this.trasactionsService.fetch({
      sorting: "createdAt desc, transactionId desc"
    }).subscribe(transactions => {
      this.transactions = transactions;
    })
  }

  save() {
    this.alertsService.dismissAll();
    if(this.changedItems.length === 0) {
      this.alertsService.warning("No data has changed.");
      return;
    }
    this.trasactionsService.batchUpdate(this.changedItems)
      .subscribe(result => {
        this.changedItems.length = 0;
      });
  }

}
