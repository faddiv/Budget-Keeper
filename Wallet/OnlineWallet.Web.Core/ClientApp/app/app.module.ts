import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { AlertModule } from "ngx-bootstrap/alert";
import { NguiAutoCompleteModule } from 'ngui/auto-complete';
import { BASE_PATH, WalletApiModule } from "walletApi";
import { DirectivesModule } from "directives";

import { environment } from '../environments/environment';

import { GlobalErrorHandler } from "walletCommon";
import { AppComponent } from './app.component';
import { WalletsComponent } from './wallets/wallets.component';
import { HomeComponent } from './home/home.component';
import { WalletTableComponent } from './wallets/wallet-table/wallet-table.component';
import { WalletsFilterRowComponent } from './wallets/wallets-filter-row/wallets-filter-row.component';
import { WalletAddComponent } from './wallets/wallet-add/wallet-add.component';
import { AddTransactionComponent } from './home/add-transaction/add-transaction.component';
import { ImportTransactionsComponent } from './import/import-transactions/import-transactions.component';
import { ImportComponent } from './import/import.component';
import { AskIfFormDirtyService } from './common/ask-if-form-dirty.service';
import { AlertsComponent } from './common/alerts/alerts.component';
import { PagedTransactionTableComponent, TransactionTableComponent } from './common/transaction-view';
import { StockTableComponent } from './import/stock-table/stock-table.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ExportComponent } from './export/export.component';
import { DismissAlertsOnLeaveService, AlertsService } from 'app/common/alerts';
import { BalanceComponent } from './transactions/balance/balance.component';
import { IRootState, rootReducer, createInitialState, freezeState } from "app/redux";

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
    AlertsComponent,
    PagedTransactionTableComponent,
    TransactionTableComponent,
    StockTableComponent,
    TransactionsComponent,
    ExportComponent,
    BalanceComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    WalletApiModule,
    DirectivesModule,
    NgReduxModule,
    NguiAutoCompleteModule,
    RouterModule.forRoot([
      {
        path: "wallets",
        component: WalletsComponent,
        canDeactivate: [DismissAlertsOnLeaveService]
      },
      {
        path: "import",
        component: ImportComponent,
        canDeactivate: [DismissAlertsOnLeaveService]
      },
      {
        path: "export",
        component: ExportComponent,
        canDeactivate: [DismissAlertsOnLeaveService]
      },
      {
        path: "transactions",
        component: TransactionsComponent,
        canDeactivate: [DismissAlertsOnLeaveService]
      },
      {
        path: "",
        component: HomeComponent,
        canDeactivate: [AskIfFormDirtyService, DismissAlertsOnLeaveService]
      }
    ])
  ],
  providers: [
    { provide: BASE_PATH, useValue: environment.WALLET_API_PATH },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    AskIfFormDirtyService,
    AlertsService,
    DismissAlertsOnLeaveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(ngRedux: NgRedux<IRootState>) {
    ngRedux.configureStore(rootReducer, createInitialState(), [
      freezeState
    ]);
  }
}
