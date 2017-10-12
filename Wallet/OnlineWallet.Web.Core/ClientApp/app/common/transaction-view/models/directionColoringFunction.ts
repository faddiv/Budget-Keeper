
import { TransactionViewModel } from "./TransactionViewModel";
import { MoneyDirection } from "walletApi";

export function directionColoringFunction(item: TransactionViewModel): void {
    switch (item.direction) {
        case MoneyDirection.Income:
            item.cssClass = "success";
            break;
        case MoneyDirection.Plan:
            item.cssClass = "warning";
            break;
        default:
            item.cssClass = undefined;
            break;
    }
}