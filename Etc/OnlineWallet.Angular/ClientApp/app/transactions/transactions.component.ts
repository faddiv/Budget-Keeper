import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { Transaction, TransactionsService } from "walletApi";
import { AlertsService } from "app/common/alerts";
import { directionColoringFunction, TransactionViewModel } from "app/common/transaction-view";
import * as moment from "moment";
import { ListHelpers } from "walletCommon";

@Component({
  moduleId: module.id.toString(),
  selector: "app-transactions",
  templateUrl: "./transactions.component.html"
})
export class TransactionsComponent implements OnInit {

  now = moment().startOf("day");
  transactions: Transaction[];
  pageItems: Transaction[];
  changedItems: Transaction[] = [];
  deletedItems: number[] = [];
  rowColoring = directionColoringFunction;
  selectedYear: string;
  selectedMonth: string;
  months: number[] = [];
  years: number[] = [];

  constructor(
    private trasactionsService: TransactionsService,
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
      this.select(this.selectedYear, this.selectedMonth);
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
    const start = moment(year + "-" + month + "-01");
    const end = moment(start).endOf("month");
    this.selectedYear = year;
    this.selectedMonth = month;
    this.pageItems = this.transactions && this.transactions.length
      ? this.transactions.filter(tr => {
        const created = moment(tr.createdAt);
        return created.isSameOrAfter(start) && created.isSameOrBefore(end);
      })
      : [];
  }

  save() {
    this.alertsService.dismissAll();
    if (this.changedItems.length === 0 && this.deletedItems.length === 0) {
      this.alertsService.warning("No data has changed.");
      return;
    }
    this.trasactionsService.batchUpdate(this.changedItems, this.deletedItems)
      .subscribe(result => {
        this.changedItems.length = 0;
        this.alertsService.success("Changes saved successfully.");
      });
  }

  delete(item: TransactionViewModel) {
    this.transactions = ListHelpers.remove(this.transactions, item.original);
    this.deletedItems.push(item.transactionId);
    this.select(this.selectedYear, this.selectedMonth);
  }

  monthColor(month: string) {
    const year = parseInt(this.selectedYear, 10);
    const currentMonth = this.now.month() + 1;
    const selectedMonth = parseInt(this.selectedMonth, 10);
    const inspectedMonth = parseInt(month, 10);
    if (inspectedMonth === selectedMonth) {
      return "btn-primary";
    }
    if (year < this.now.year()) {
      return "btn-default";
    }
    if (year > this.now.year()) {
      return "disabled";
    }
    return inspectedMonth > currentMonth
      ? "disabled"
      : "btn-default";
  }

  private generateDateSelector() {
    this.years = ListHelpers.createRange(2009, this.now.year());
    this.months = ListHelpers.createRange(1, 12);
  }
}
