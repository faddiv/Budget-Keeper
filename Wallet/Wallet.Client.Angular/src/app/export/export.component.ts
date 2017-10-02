import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  form = new FormGroup({
    file: new FormControl("", [
      Validators.required
    ])
  });

  rangeType: number = 1;
  rangeTypes = [{
    value: 1,
    name: "Year/Month"
  }, {
    value: 2,
    name: "From-To"
  }];

  year: number;
  month: number;
  rangeFrom: string;
  rangeTo: string;

  constructor() {
    var now = moment();
    this.year = now.year();
    this.month = now.month() + 1;
    this.rangeFrom = now.startOf("month").format("YYYY-MM-DD");
    this.rangeTo = now.endOf("month").format("YYYY-MM-DD");
  }

  get file() {
    return <FormControl>this.form.controls.file;
  }
  ngOnInit() {
  }

  download() {
    alert(this.rangeType);
  }
}
