import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MoneyOperation, Wallet, ApiError } from "walletApi";
import { ICommand } from "directives";

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {

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

  submitted = false;

  @Input("wallets")
  wallets: Wallet[] = [];

  focusName: ICommand<any> = {};

  @Output("add")
  add = new EventEmitter<MoneyOperation>();

  constructor() { }

  ngOnInit() {
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
    this.submitted = true;
    if (this.form.invalid) return;
    var newItem: MoneyOperation = {
      comment: this.comment.value,
      createdAt: new Date(),
      direction: MoneyOperation.DirectionEnum.NUMBER_1,
      name: this.name.value,
      value: this.price.value,
      moneyOperationId: 0,
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
    this.submitted = false;
    this.focusName.execute();
  }

  dismissError() {
    this.submitted = false;
  }
}
