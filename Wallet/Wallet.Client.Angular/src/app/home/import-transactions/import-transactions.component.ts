import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExportImportRow, ImportService } from "walletApi";

@Component({
  selector: 'app-import-transactions',
  templateUrl: './import-transactions.component.html',
  styleUrls: ['./import-transactions.component.scss']
})
export class ImportTransactionsComponent implements OnInit {

  private fileObject: File;

  @Output("load")
  load = new EventEmitter<ExportImportRow[]>();

  constructor(private importService: ImportService) { }

  ngOnInit() {
  }

  setFile($event: Event) {
    let fileList: FileList = (<HTMLInputElement>event.target).files;
    if (fileList.length > 0) {
      this.fileObject = fileList[0]
    }
  }
  onLoad() {
    this.importService.uploadTransactions(this.fileObject)
      .subscribe(result => {
        this.load.emit(result);
      });
  }
}
