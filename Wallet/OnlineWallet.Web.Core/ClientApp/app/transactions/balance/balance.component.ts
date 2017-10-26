import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TransactionsService, BalanceInfo } from "walletApi";

@Component({
  moduleId: module.id.toString(),
  selector: "app-balance",
  templateUrl: "./balance.component.html",
  styleUrls: ["./balance.component.scss"]
})
export class BalanceComponent implements OnInit, OnChanges {

  @Input()
  year: number;

  @Input()
  month: number;

  balance: BalanceInfo = {};

  constructor(
    private transactionsService: TransactionsService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.year && this.month) {
      this.transactionsService.balanceInfo(this.year, this.month)
        .subscribe(balance => {
          this.balance = balance || {};
        });
    }
  }
}
