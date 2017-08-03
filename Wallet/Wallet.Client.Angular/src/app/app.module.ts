import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
//import {} from "ngx-bootstrap";

import { BASE_PATH, WalletApi } from "../walletApi/index";
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { WalletsComponent } from './wallets/wallets.component';
import { HomeComponent } from './home/home.component';
import { WalletTableComponent } from './wallets/wallet-table/wallet-table.component';
import { WalletTableRowComponent } from './wallets/wallet-table/wallet-table-row/wallet-table-row.component';

@NgModule({
  declarations: [
    AppComponent,
    WalletsComponent,
    HomeComponent,
    WalletTableComponent,
    WalletTableRowComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
  {
    path: "wallets",
    component: WalletsComponent
  },
  {
    path: "",
    component: HomeComponent
  },
  
])
  ],
  providers: [
    WalletApi,
    {provide: BASE_PATH, useValue: environment.WALLET_API_PATH}],
  bootstrap: [AppComponent]
})
export class AppModule { }
