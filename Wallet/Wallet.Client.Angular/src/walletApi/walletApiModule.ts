import { NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { WalletApi,ImportApi } from "./api/api";
import { WalletService } from "./walletService";
import { ImportService } from "./importService";

@NgModule({
    imports: [
        HttpModule
        //,CommonModule
    ],
    providers: [
        WalletApi,
        ImportApi,
        WalletService,
        ImportService
    ]
})
export class WalletApiModule { }