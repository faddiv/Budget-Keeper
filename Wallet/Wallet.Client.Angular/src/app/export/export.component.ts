import { Component, OnInit, SimpleChanges } from '@angular/core';
import * as moment from "moment";
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ExportService } from 'walletApi';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  form = new FormGroup({
    file: new FormControl("", [
      Validators.required
    ]),
    rangeType: new FormControl("1", [
      Validators.required
    ]),
    yearMonth: new FormGroup({
      year: new FormControl(null, [
        Validators.required
      ]),
      month: new FormControl(null, [
        Validators.required
      ])
    }),
    fromTo: new FormGroup({
      rangeFrom: new FormControl(null, [
        Validators.required
      ]),
      rangeTo: new FormControl(null, [
        Validators.required
      ])
    })
  });

  rangeTypes = [{
    value: "1",
    name: "Year/Month"
  }, {
    value: "2",
    name: "From-To"
  }];

  constructor(
    private exportService: ExportService) {
    var now = moment();
    this.year.setValue(now.year());
    this.month.setValue(now.month() + 1);
    this.rangeFrom.setValue(now.startOf("month").format("YYYY-MM-DD"));
    this.rangeTo.setValue(now.endOf("month").format("YYYY-MM-DD"));
  }

  get file() {
    return <FormControl>this.form.get("file");
  }

  get rangeType() {
    return <FormControl>this.form.get("rangeType");
  }

  get yearMonth() {
    return <FormGroup>this.form.get("yearMonth");
  }
  get year() {
    return <FormControl>this.yearMonth.get("year");
  }
  get month() {
    return <FormControl>this.yearMonth.get("month");
  }

  get fromTo() {
    return <FormGroup>this.form.get("fromTo");
  }
  get rangeFrom() {
    return <FormControl>this.fromTo.get("rangeFrom");
  }
  get rangeTo() {
    return <FormControl>this.fromTo.get("rangeTo");
  }

  ngOnInit() {
    this.rangeType.valueChanges.subscribe(data => {
      this.setEnabled(this.yearMonth, data === "1");
      this.setEnabled(this.fromTo, data === "2");
    });
  }

  setEnabled(control: AbstractControl, enabled: boolean) {
    if (enabled) {
      control.enable();
    } else {
      control.disable();
    }
  }
  download() {
    if (this.form.invalid) {

      return;
    }
    var rangeFrom: string;
    var rangeTo: string;
    if (this.rangeType.value == "1") {
      var from = moment([parseInt(this.year.value), parseInt(this.month.value)-1, 1]);
      rangeFrom = from.format("YYYY-MM-DD");
      rangeTo = from.endOf("month").format("YYYY-MM-DD");
    } else {
      rangeFrom = this.rangeFrom.value;
      rangeTo = this.rangeTo.value;
    }
    this.exportService.exportRange(rangeFrom, rangeTo, this.file.value);
  }
}
