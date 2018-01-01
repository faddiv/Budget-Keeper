import { BalanceInfo } from "walletApi";

export interface YearlyStatistics extends BalanceInfo {

    monthly: BalanceInfo[];
}
