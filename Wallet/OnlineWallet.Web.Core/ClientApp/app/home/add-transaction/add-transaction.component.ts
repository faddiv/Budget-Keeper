import { Component, OnInit, EventEmitter, Output, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Transaction, Wallet, ArticleService, ArticleModel, WalletService } from "walletApi";
import { AlertsService } from "app/common/alerts";
import * as moment from "moment";
import { dateFormat } from "app/common/constants";
import { FocusService } from "directives";
import { toUTCDate } from "walletCommon";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

@Component({
  moduleId: module.id.toString(),
  selector: "app-add-transaction",
  templateUrl: "./add-transaction.component.html"
})
export class AddTransactionComponent implements OnInit, AfterViewInit {

  form = new FormGroup({
    wallet: new FormControl("2", [
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

  @Output("add")
  add = new EventEmitter<Transaction>();

  @Output("save")
  save = new EventEmitter<any>();

  wallets: Wallet[];

  constructor(
    private alertsService: AlertsService,
    private focusService: FocusService,
    private articleService: ArticleService,
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.walletService.getAll().subscribe(wallets => {
      this.wallets = wallets;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.focusStart(); });
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
    const newItem: Transaction = {
      comment: this.comment.value,
      createdAt: toUTCDate(this.created.value),
      direction: this.direction.value,
      name: this.getName(),
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
    const patch: any = {};
    for (const key in this.form.controls) {
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
      this.alertsService.error("Wallet is required.");
    }
    if (this.created.errors && this.created.errors.required) {
      this.alertsService.error("Date is required.");
    }
    if (this.name.errors && this.name.errors.required) {
      this.alertsService.error("Name is required.");
    }
    if (this.price.errors) {
      if (this.price.errors.required) {
        this.alertsService.error("Price is required.");
      }
      if (this.price.errors.pattern) {
        this.alertsService.error("Price must be a number.");
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

  autofill(data: ArticleModel | string) {
    if (typeof (data) !== "string") {
      this.form.patchValue({
        category: data.category,
        price: data.lastPrice
      }, {
          emitEvent: true
        });
    }
  }

  private getName() {
    if (!this.name.value) { return undefined; }
    if (typeof this.name.value === "object") { return this.name.value.name; }
    return this.name.value;
  }
}
