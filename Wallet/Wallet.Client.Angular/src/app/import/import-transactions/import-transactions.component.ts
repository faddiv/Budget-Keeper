import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExportImportRow, ImportService, ApiError } from "walletApi";

@Component({
  selector: 'app-import-transactions',
  templateUrl: './import-transactions.component.html',
  styleUrls: ['./import-transactions.component.scss']
})
export class ImportTransactionsComponent implements OnInit {

  invalidFile = false;
  loading = false;
  fileList: FileList;
  errors = {
    validFile: true,
    filled: true,
    get invalid(): boolean {
      return !this.validFile || !this.filled;
    }
  };

  @Output("load")
  load = new EventEmitter<ExportImportRow[]>();

  @Output("save")
  save = new EventEmitter<any>();

  @Input()
  canSave: boolean;

  constructor(private importService: ImportService) { }

  ngOnInit() {
  }

  onLoad() {
    this.dismissError();
    if (!this.fileList || !this.fileList.length) {
      this.errors.filled = false;
      return;
    }
    this.loading = true;
    this.importService.uploadTransactions(this.fileList[0])
      .subscribe(result => {
        this.load.emit(result);
        this.loading = false;
        this.fileList = null;
      }, (error: ApiError) => {
        this.errors.validFile = false;
        this.loading = false;
      });
  }

  dismissError() {
    this.errors.filled = true;
    this.errors.validFile = true;
  }
}
