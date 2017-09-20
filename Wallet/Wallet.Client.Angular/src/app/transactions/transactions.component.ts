import { Component, OnInit } from '@angular/core';
import { Transaction, TrasactionsService } from 'walletApi';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[];

  constructor(
    private trasactionsService: TrasactionsService
  ) { }

  ngOnInit() {
    this.trasactionsService.fetch({

    }).subscribe(transactions => {
      this.transactions = transactions;
    })
  }

}
