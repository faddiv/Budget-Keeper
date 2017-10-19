import { NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { WalletApi, ImportApi, TransactionApi, ArticleApi } from "./api/api";
import { WalletService } from "./walletService";
import { ImportService } from "./importService";
import { ExportService } from "./exportService";
import { TransactionsService } from "./transactionsService";
import { ArticleService } from './articleService';

@NgModule({
    imports: [
        HttpModule
        //,CommonModule
    ],
    providers: [
        WalletApi,
        ImportApi,
        TransactionApi,
        ArticleApi,
        WalletService,
        ImportService,
        ExportService,
        TransactionsService,
        ArticleService
    ]
})
export class WalletApiModule { }