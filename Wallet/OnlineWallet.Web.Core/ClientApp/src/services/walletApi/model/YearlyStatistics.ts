import { BalanceInfo } from "./BalanceInfo";

export interface YearlyStatistics extends BalanceInfo {

    monthly: BalanceInfo[];
}
