import { Component, OnInit, SimpleChanges } from '@angular/core';
import * as moment from "moment";
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

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

  constructor() {
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
    if(enabled) {
      control.enable();
    } else {
      control.disable();
    }
  }
  download() {
    alert(this.form.valid);
  }
}
