
import { TransactionViewModel } from "./TransactionViewModel";
import { MoneyDirection } from "walletApi";

export function directionColoringFunction(item: TransactionViewModel): void {
    switch (item.direction) {
        case MoneyDirection.Income:
            item.cssClass = "table-success";
            break;
        case MoneyDirection.Plan:
            item.cssClass = "table-warning";
            break;
        default:
            item.cssClass = undefined;
            break;
    }
}
