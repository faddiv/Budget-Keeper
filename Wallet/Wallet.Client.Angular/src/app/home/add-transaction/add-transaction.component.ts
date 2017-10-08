import { Component, OnInit, OnChanges, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Transaction, Wallet, ApiError } from "walletApi";
import { ICommand } from "directives";
import { AlertsService } from 'app/common/alerts';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit, OnChanges {

  form = new FormGroup({
    wallet: new FormControl("", [
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
  });

  @Input("wallets")
  wallets: Wallet[];

  focusName: ICommand<any> = {};

  @Output("add")
  add = new EventEmitter<Transaction>();

  @Output("save")
  save = new EventEmitter<any>();

  constructor(
    private alertsService: AlertsService
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

  get name(): FormControl {
    return <FormControl>this.form.controls.name;
  }

  get price(): FormControl {
    return <FormControl>this.form.controls.price;
  }

  get comment(): FormControl {
    return <FormControl>this.form.controls.comment;
  }


  onAdd() {
    this.alertsService.dismissAll();
    if (this.form.invalid) {
      this.showValidationErrors();
      return;
    }
    var newItem: Transaction = {
      comment: this.comment.value,
      createdAt: new Date(),
      direction: Transaction.DirectionEnum.NUMBER_1,
      name: this.name.value,
      value: this.price.value,
      transactionId: 0,
      walletId: this.wallet.value
    };
    this.add.emit(newItem);
    this.clearFields();
  }

  clearFields() {
    var patch: any = {};
    for (var key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key) && this.form.controls[key] instanceof FormControl) {
        patch[key] = "";
      }
    }
    patch.wallet = this.wallets.length && this.wallets[0].moneyWalletId;
    this.form.patchValue(patch, {
      emitEvent: false
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.focusName.execute();
    this.alertsService.dismissAll();
  }

  showValidationErrors() {
    if (this.wallet.errors && this.wallet.errors.required) {
      this.alertsService.error("Wallet is required.")
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
}
