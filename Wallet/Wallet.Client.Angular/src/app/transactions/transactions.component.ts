import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Transaction, TrasactionsService } from 'walletApi';
import { AlertsService } from 'app/common/alerts';
import { directionColoringFunction } from 'app/common/transaction-view';
import * as moment from "moment";
import { ListHelpers } from 'walletCommon';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  now = moment().startOf("day");
  transactions: Transaction[];
  pageItems: Transaction[];
  changedItems: Transaction[] = [];
  rowColoring = directionColoringFunction;
  selectedYear: string;
  selectedMonth: string;
  months: number[] = [];
  years: number[] = [];

  constructor(
    private trasactionsService: TrasactionsService,
    private alertsService: AlertsService
  ) {
    this.selectedYear = this.now.year().toString();
    this.selectedMonth = (this.now.month() + 1).toString();
  }

  get hasElements() {
    return this.pageItems && this.pageItems.length;
  }

  ngOnInit() {
    this.trasactionsService.fetch({
      sorting: "createdAt desc, transactionId desc"
    }).subscribe(transactions => {
      this.transactions = transactions;
      this.generateDateSelector();
      this.select(this.selectedYear, this.selectedMonth)
    });
  }

  selectYear(year: string) {
    this.select(year, this.selectedMonth);
    this.generateDateSelector();
  }

  selectMonth(month: string) {
    this.select(this.selectedYear, month);
  }

  select(year: string, month: string) {
    var start = moment(year + "-" + month + "-01");
    var end = moment(start).endOf("month");
    this.selectedYear = year;
    this.selectedMonth = month;
    this.pageItems = this.transactions && this.transactions.length
      ? this.transactions.filter(tr => {
        var created = moment(tr.createdAt);
        return created.isSameOrAfter(start) && created.isSameOrBefore(end)
      })
      : [];
  }

  save() {
    this.alertsService.dismissAll();
    if (this.changedItems.length === 0) {
      this.alertsService.warning("No data has changed.");
      return;
    }
    this.trasactionsService.batchUpdate(this.changedItems)
      .subscribe(result => {
        this.changedItems.length = 0;
        this.alertsService.success("Changes saved successfully.");
      });
  }

  monthColor(month: string) {
    var year = parseInt(this.selectedYear);
    var currentMonth = this.now.month() + 1;
    var selectedMonth = parseInt(this.selectedMonth);
    var inspectedMonth = parseInt(month);
    if(inspectedMonth === selectedMonth) {
      return "btn-primary";
    }
    if (year < this.now.year())
      return "btn-default";
    if (year > this.now.year())
      return "disabled";
    return inspectedMonth > currentMonth
      ? "disabled"
      : "btn-default";
  }

  private generateDateSelector() {
    this.years = ListHelpers.createRange(2009, this.now.year());
    //var month = parseInt(this.selectedYear) === this.now.year() ? this.now.month() + 1 : 12;
    this.months = ListHelpers.createRange(1, 12);
  }
}
