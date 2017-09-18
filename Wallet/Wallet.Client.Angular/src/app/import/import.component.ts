import { Component, OnInit } from '@angular/core';
import { ExportImportRow, Transaction, TrasactionsService, ApiError } from "walletApi";
import { AlertModel } from 'app/common/alerts/AlertModel';
import { ListHelpers } from 'walletCommon';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  linesToSave: Transaction[] = [];
  alerts: AlertModel[] = [];
  current: string = 'full';
  canSave = false;

  constructor(private transactionsService: TrasactionsService) {

  }

  get numRow() {
    return this.linesToSave.length;
  }
  ngOnInit() {
  }

  addLines(newItems: Array<ExportImportRow> = []) {
    this.linesToSave = newItems.map(e => <Transaction>{
      comment: e.comment,
      createdAt: e.created,
      direction: e.direction,
      name: e.name,
      transactionId: e.matchingId || 0,
      value: e.amount,
      walletId: e.source,
      category: e.category
    });
    this.canSave = true;
  }

  show(menu: string) {
    this.current = menu;
  }

  save() {
    if (!this.canSave) return;
    this.transactionsService.batchUpdate(this.linesToSave)
      .subscribe(() => {
        this.alerts.push(AlertModel.success("Items saved successfully"));
        this.linesToSave = [];
      }, (error: ApiError) => {
        this.alerts.push(AlertModel.error(error.message));
      })
  }

}
