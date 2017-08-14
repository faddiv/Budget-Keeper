import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MoneyOperation } from "walletApi";

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  linesToSave: MoneyOperation[];
  nameValue: string;
  price: string;

  @ViewChild("name")
  nameElement: ElementRef;

  @ViewChild("#price")
  priceElement;

  constructor() { 

  }

  startNew() {
    this.linesToSave = [];
  }

  ngOnInit() {
    this.startNew();
  }

  add($event: Event) {
    $event.preventDefault();
    console.log(this);
    if(!name) {
      
    }
  }
}
