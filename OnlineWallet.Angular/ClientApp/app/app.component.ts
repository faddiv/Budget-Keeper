import { Component } from '@angular/core';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  menuItems: IMenuItem[];

  constructor() {
    this.menuItems = [
      {
        title: "Home",
        path: [""]
      },
      {
        title: "Transactions",
        path: ["transactions"]
      },
      {
        title: "Import",
        path: ["import"]
      },
      {
        title: "Export",
        path: ["export"]
      },
      {
        title: "Wallets",
        path: ["wallets"]
      }
    ]
  }
}

export interface IMenuItem {
  path: string[];
  title: string;
}