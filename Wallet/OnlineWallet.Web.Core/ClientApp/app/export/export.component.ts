import { Component, OnInit, SimpleChanges } from "@angular/core";
import * as moment from "moment";
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { ExportService } from "walletApi";
import { AlertsService } from "app/common/alerts";
import { dateFormat } from "app/common/constants";

@Component({
  moduleId: module.id.toString(),
  selector: "app-export",
  templateUrl: "./export.component.html"
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
    private exportService: ExportService,
    private alertsService: AlertsService) {
    const now = moment();
    this.year.setValue(now.year());
    this.month.setValue(now.month() + 1);
    this.rangeFrom.setValue(now.startOf("month").format(dateFormat));
    this.rangeTo.setValue(now.endOf("month").format(dateFormat));
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
    this.alertsService.dismissAll();
    if (this.form.invalid) {
      this.showValidationErrors();
      return;
    }
    let rangeFrom: string;
    let rangeTo: string;
    if (this.rangeType.value === "1") {
      const from = moment([parseInt(this.year.value, 10), parseInt(this.month.value, 10) - 1, 1]);
      rangeFrom = from.format(dateFormat);
      rangeTo = from.endOf("month").format(dateFormat);
    } else {
      rangeFrom = this.rangeFrom.value;
      rangeTo = this.rangeTo.value;
    }
    this.exportService.exportRange(rangeFrom, rangeTo, this.file.value);
  }


  showValidationErrors() {
    if (this.file.errors && this.file.errors.required) {
      this.alertsService.error("File name is required.");
    }
    if (this.year.errors && this.year.errors.required) {
      this.alertsService.error("Year is required.");
    }
    if (this.month.errors && this.month.errors.required) {
      this.alertsService.error("Month is required.");
    }
    if (this.rangeFrom.errors && this.rangeFrom.errors.required) {
      this.alertsService.error("From is required.");
    }
    if (this.rangeTo.errors && this.rangeTo.errors.required) {
      this.alertsService.error("To is required.");
    }
  }
}
