import { NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { WalletApi } from "walletApi/api/api";
import { WalletService } from "walletApi";

@NgModule({
    imports: [
        HttpModule
        //,CommonModule
    ],
    providers: [
        WalletApi,
        WalletService
    ]
})
export class WalletApiModule { }