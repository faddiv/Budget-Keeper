import { Component, OnInit } from "@angular/core";
import { ExportImportRow, Transaction, TransactionsService, ApiError, WalletService, Wallet } from "walletApi";
import { AlertModel } from "app/common/alerts/AlertModel";
import { ListHelpers } from "walletCommon";
import { StockModel } from "./stock-table/StockModel";
import { AlertsService } from "app/common/alerts";
import { TransactionViewModel } from "app/common/transaction-view";

@Component({
  moduleId: module.id.toString(),
  selector: "app-import",
  templateUrl: "./import.component.html"
})
export class ImportComponent implements OnInit {
  linesToSave: Transaction[] = [];
  stocks: StockModel[];
  current = "full";
  canSave = false;
  wallets: Wallet[];

  constructor(
    private transactionsService: TransactionsService,
    private alertsService: AlertsService,
    private walletService: WalletService) {

  }

  get numRow() {
    return this.linesToSave.length;
  }
  ngOnInit() {
    this.walletService.getAll()
      .subscribe(result => {
        this.wallets = result;
      });
  }

  addLines(newItems: Array<ExportImportRow> = []) {
    if (!this.wallets) {
      this.alertsService.error("The wallet list didn't load. Can't create transaction rows.");
      return;
    }
    this.linesToSave = newItems.map(e => <Transaction>{
      comment: e.comment,
      createdAt: e.created,
      direction: e.direction,
      name: e.name,
      transactionId: e.matchingId || 0,
      value: e.amount,
      walletId: this.getWalletId(e.source) || 1,
      category: e.category,

    });
    this.stocks = [];
    const grouping: {
      [name: string]: StockModel
    } = {};
    for (let index = 0; index < newItems.length; index++) {
      const element = newItems[index];
      if (grouping[element.name]) {
        grouping[element.name].category = grouping[element.name].category || element.category;
        grouping[element.name].count++;
      } else {
        grouping[element.name] = new StockModel(element.name, element.category, 1);
      }
    }
    for (const key in grouping) {
      if (grouping.hasOwnProperty(key)) {
        this.stocks.push(grouping[key]);
      }
    }
    this.stocks.sort((left, right) => right.count - left.count);
    this.canSave = true;
  }

  show(menu: string) {
    this.current = menu;
  }

  save() {
    if (!this.canSave) {
      return;
    }
    this.alertsService.dismissAll();
    this.transactionsService.batchUpdate(this.linesToSave)
      .subscribe(() => {
        this.alertsService.success("Items saved successfully");
        this.linesToSave = [];
      }, (error: ApiError) => {
        this.alertsService.error(error.message);
      });
  }

  savedItemColoring(value: TransactionViewModel) {
    value.cssClass = value.transactionId ? "info" : undefined;
  }

  private getWalletId(name: string): number | undefined {
    if (!name) { return undefined; }
    const wallet = this.wallets.find(w => w.name === name);
    return wallet && wallet.moneyWalletId;
  }
}
