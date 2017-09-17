import { NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { WalletApi, ImportApi, TransactionApi } from "./api/api";
import { WalletService } from "./walletService";
import { ImportService } from "./importService";
import { TrasactionsService } from "./transactionsService";

@NgModule({
    imports: [
        HttpModule
        //,CommonModule
    ],
    providers: [
        WalletApi,
        ImportApi,
        TransactionApi,
        WalletService,
        ImportService,
        TrasactionsService
    ]
})
export class WalletApiModule { }