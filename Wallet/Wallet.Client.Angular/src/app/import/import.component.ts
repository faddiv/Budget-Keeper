import { Component, OnInit } from '@angular/core';
import { ExportImportRow } from "walletApi";

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  linesToSave: ExportImportRow[] = [];
  current: string;

  constructor() { }

  get numRow() {
    return this.linesToSave.length;
  }
  ngOnInit() {
  }

  addLines(newItems: Array<ExportImportRow>) {
    this.linesToSave = newItems || [];
  }

  show(menu: string) {
    this.current = menu;
  }
}
