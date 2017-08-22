import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
//import {} from "ngx-bootstrap";

import { BASE_PATH, WalletApiModule } from "../walletApi/index";
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { WalletsComponent } from './wallets/wallets.component';
import { HomeComponent } from './home/home.component';
import { WalletTableComponent } from './wallets/wallet-table/wallet-table.component';
import { GlobalErrorHandler } from "common/globalErrorHandler";
import { WalletsFilterRowComponent } from './wallets/wallets-filter-row/wallets-filter-row.component';
import { WalletAddComponent } from './wallets/wallet-add/wallet-add.component';
import { AddTransactionComponent } from './home/add-transaction/add-transaction.component';
import { DirectivesModule } from "directives";

@NgModule({
  declarations: [
    AppComponent,
    WalletsComponent,
    HomeComponent,
    WalletTableComponent,
    WalletsFilterRowComponent,
    WalletAddComponent,
    AddTransactionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WalletApiModule,
    DirectivesModule,
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
    {provide: BASE_PATH, useValue: environment.WALLET_API_PATH},
    {provide: ErrorHandler, useClass: GlobalErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
