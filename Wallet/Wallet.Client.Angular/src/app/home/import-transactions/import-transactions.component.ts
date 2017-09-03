import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExportImportRow } from "walletApi";

@Component({
  selector: 'app-import-transactions',
  templateUrl: './import-transactions.component.html',
  styleUrls: ['./import-transactions.component.scss']
})
export class ImportTransactionsComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl("", [
      Validators.required
    ]),
    price: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\d+$/)
    ]),
  });

  @Output("load")
  load = new EventEmitter<ExportImportRow>();

  constructor() { }

  ngOnInit() {
  }

  onLoad() {

  }
}
