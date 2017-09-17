import { Component, OnInit } from '@angular/core';
import { ExportImportRow, Transaction } from "walletApi";

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  linesToSave: Transaction[] = [];
  current: string;
  fullListEnabled = false;

  constructor() { }

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
      transactionId: e.matchingId,
      value: e.amount,
      walletId: e.source,
      category: e.category
    });
    this.enableView();
  }

  show(menu: string) {
    this.current = menu;
    this.enableView();
  }

  private enableView() {
    if(!this.linesToSave || !this.linesToSave.length) return;
    if(this.current === 'full') {
      this.fullListEnabled = true;
    }
  }
}
