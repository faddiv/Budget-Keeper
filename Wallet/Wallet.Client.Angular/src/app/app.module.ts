import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
//import {} from "ngx-bootstrap";

import { BASE_PATH, WalletApiModule } from "walletApi";
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { WalletsComponent } from './wallets/wallets.component';
import { HomeComponent } from './home/home.component';
import { WalletTableComponent } from './wallets/wallet-table/wallet-table.component';
import { GlobalErrorHandler } from "walletCommon";
import { WalletsFilterRowComponent } from './wallets/wallets-filter-row/wallets-filter-row.component';
import { WalletAddComponent } from './wallets/wallet-add/wallet-add.component';
import { AddTransactionComponent } from './home/add-transaction/add-transaction.component';
import { DirectivesModule } from "directives";
import { ImportTransactionsComponent } from './import/import-transactions/import-transactions.component';
import { ImportComponent } from './import/import.component';
import { AskIfFormDirtyService } from './common/ask-if-form-dirty.service';
import { AlertsComponent } from './common/alerts/alerts.component';

@NgModule({
  declarations: [
    AppComponent,
    WalletsComponent,
    HomeComponent,
    WalletTableComponent,
    WalletsFilterRowComponent,
    WalletAddComponent,
    AddTransactionComponent,
    ImportTransactionsComponent,
    ImportComponent,
    AlertsComponent
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
    path: "import",
    component: ImportComponent
  },
  {
    path: "",
    component: HomeComponent,
    canDeactivate: [AskIfFormDirtyService]
  },
  
])
  ],
  providers: [
    {provide: BASE_PATH, useValue: environment.WALLET_API_PATH},
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    AskIfFormDirtyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
