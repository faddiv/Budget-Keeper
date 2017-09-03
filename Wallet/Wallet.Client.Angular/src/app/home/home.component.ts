import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MoneyOperation, ExportImportRow } from "walletApi";

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  linesToSave: MoneyOperation[];

  constructor() {

  }

  startNew() {
    this.linesToSave = [];
  }

  ngOnInit() {
    this.startNew();
  }

  addLine(newItem: MoneyOperation) {
    this.linesToSave.push(newItem);
  }

  addLines(newItems: Array<ExportImportRow>) {
    for (var index = 0; index < newItems.length; index++) {
      var element = newItems[index];
      this.linesToSave.push({
        comment: element.comment,
        createdAt: element.created,
        direction: element.direction,
        name: element.name,
        value: element.amount,
        walletId: 0
      });
    }
  }
}
