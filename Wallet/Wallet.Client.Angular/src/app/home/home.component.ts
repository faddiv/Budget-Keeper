import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MoneyOperation } from "walletApi";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  linesToSave: MoneyOperation[];

  form = new FormGroup({
    name: new FormControl("", [
      Validators.required
    ]),
    price: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\d+$/)
    ]),
  })
  
  get name() : FormControl {
    return <FormControl>this.form.controls.name;
  }

  get price() : FormControl {
    return <FormControl>this.form.controls.price;
  }
  
  constructor() { 

  }

  startNew() {
    this.linesToSave = [];
  }

  ngOnInit() {
    this.startNew();
  }

  add() {
    if(this.form.invalid) return;
    this.linesToSave.push({
      comment: "",
      createdAt: new Date(),
      direction: MoneyOperation.DirectionEnum.NUMBER_1,
      name: this.name.value,
      value: this.price.value,
      moneyOperationId: 0,
      walletId: 0
    });
  }
}
