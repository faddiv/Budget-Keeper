import { Component, OnInit, OnChanges, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Transaction, Wallet, ApiError, MoneyDirection, ArticleService, ArticleModel } from "walletApi";
import { AlertsService } from 'app/common/alerts';
import * as moment from "moment";
import { dateFormat } from 'app/common/constants';
import { FocusService } from 'directives';
import { toUTCDate } from 'walletCommon';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html'
})
export class AddTransactionComponent implements OnInit, OnChanges {

  form = new FormGroup({
    wallet: new FormControl("", [
      Validators.required
    ]),
    created: new FormControl(moment().format(dateFormat), [
      Validators.required
    ]),
    name: new FormControl("", [
      Validators.required
    ]),
    price: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\d+$/)
    ]),
    comment: new FormControl(""),
    category: new FormControl(""),
    direction: new FormControl("-1", [
      Validators.required
    ])
  });

  @Input("wallets")
  wallets: Wallet[];

  @Output("add")
  add = new EventEmitter<Transaction>();

  @Output("save")
  save = new EventEmitter<any>();

  constructor(
    private alertsService: AlertsService,
    private focusService: FocusService,
    private articleService:ArticleService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.wallets && this.wallets.length && !this.wallet.enabled) {
      this.wallet.enable();
      if (!this.wallet.value) {
        this.wallet.setValue("2");
      }
    } else {
      this.wallet.disable();
    }
  }

  get wallet(): FormControl {
    return <FormControl>this.form.controls.wallet;
  }

  get created(): FormControl {
    return <FormControl>this.form.controls.created;
  }

  get name(): FormControl {
    return <FormControl>this.form.controls.name;
  }

  get price(): FormControl {
    return <FormControl>this.form.controls.price;
  }

  get comment(): FormControl {
    return <FormControl>this.form.controls.comment;
  }

  get category(): FormControl {
    return <FormControl>this.form.controls.category;
  }
  
  get direction(): FormControl {
    return <FormControl>this.form.controls.direction;
  }


  onAdd() {
    this.alertsService.dismissAll();
    if (this.form.invalid) {
      this.showValidationErrors();
      return;
    }
    var newItem: Transaction = {
      comment: this.comment.value,
      createdAt: toUTCDate(this.created.value),
      direction: this.direction.value,
      name: this.name.value && this.name.value.name,
      category: this.category.value,
      value: this.price.value,
      transactionId: 0,
      walletId: this.wallet.value
    };
    this.add.emit(newItem);
    this.clearFields();
  }

  clearFields() {
    console.log("clearFields");
    var patch: any = {};
    for (var key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key) && this.form.controls[key] instanceof FormControl) {
        patch[key] = "";
      }
    }
    patch.wallet = this.wallet.value;
    patch.created = this.created.value;
    patch.direction = this.direction.value;
    this.form.patchValue(patch, {
      emitEvent: false
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.focusStart();
    this.alertsService.dismissAll();
  }

  focusStart() {
    this.focusService.focus("name");
  }

  showValidationErrors() {
    if (this.wallet.errors && this.wallet.errors.required) {
      this.alertsService.error("Wallet is required.")
    }
    if (this.created.errors && this.created.errors.required) {
      this.alertsService.error("Date is required.")
    }
    if (this.name.errors && this.name.errors.required) {
      this.alertsService.error("Name is required.")
    }
    if (this.price.errors) {
      if (this.price.errors.required) {
        this.alertsService.error("Price is required.")
      }
      if (this.price.errors.pattern) {
        this.alertsService.error("Price must be a number.")
      }
    }
  }

  nameFilter(keyword: string): Observable<any[]> {
    
    if (keyword) {
      return this.articleService.filterBy(keyword);
    } else {
      return Observable.of([]);
    }
  }

  nameListFormatter(data: ArticleModel) {
    return data.nameHighlighted;
  }

  autofill(data: ArticleModel) {
    this.form.patchValue({
      category: data.category,
      price: data.lastPrice
    }, {
      emitEvent: true
    });
  }
}
