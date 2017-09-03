import { NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { WalletApi } from "./api/api";
import { WalletService } from "./walletService";

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