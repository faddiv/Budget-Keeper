import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExportImportRow, ImportService, ApiError } from "walletApi";
import { AlertsService } from 'app/common/alerts';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-import-transactions',
  templateUrl: './import-transactions.component.html'
})
export class ImportTransactionsComponent implements OnInit {

  invalidFile = false;
  loading = false;
  fileList: FileList;

  @Output("load")
  load = new EventEmitter<ExportImportRow[]>();

  @Output("save")
  save = new EventEmitter<any>();

  @Input()
  canSave: boolean;

  constructor(
    private importService: ImportService,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {
  }

  onLoad() {
    this.alertsService.dismissAll();
    if (!this.fileList || !this.fileList.length) {
      this.alertsService.error("Please select a .csv file.");
      return;
    }
    this.loading = true;
    this.importService.uploadTransactions(this.fileList[0])
      .subscribe(result => {
        this.load.emit(result);
        this.loading = false;
        this.fileList = null;
      }, (error: ApiError) => {
        this.alertsService.error("Invalid File. Please select a valid .csv file.");
        this.loading = false;
      });
  }
}
