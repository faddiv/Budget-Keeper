import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MoneyOperation } from "walletApi";
import { ICommand } from "directives";

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl("", [
      Validators.required
    ]),
    price: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\d+$/)
    ]),
  });

  submitted = false;

  focusName: ICommand<any> = {};

  @Output("add")
  add = new EventEmitter<MoneyOperation>();

  constructor() { }

  ngOnInit() {
  }

  get name(): FormControl {
    return <FormControl>this.form.controls.name;
  }

  get price(): FormControl {
    return <FormControl>this.form.controls.price;
  }


  onAdd() {
    this.submitted = true;
    if (this.form.invalid) return;
    var newItem: MoneyOperation = {
      comment: "",
      createdAt: new Date(),
      direction: MoneyOperation.DirectionEnum.NUMBER_1,
      name: this.name.value,
      value: this.price.value,
      moneyOperationId: 0,
      walletId: 0
    };
    this.add.emit(newItem);
    this.clearFields();
  }

  clearFields() {
    this.form.patchValue({
      name: "",
      price: ""
    }, {
        emitEvent: false
      });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.submitted = false;
    this.focusName.execute();
  }
}
