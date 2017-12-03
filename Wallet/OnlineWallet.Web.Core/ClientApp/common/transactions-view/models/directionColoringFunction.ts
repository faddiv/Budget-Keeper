import { MoneyDirection } from "walletApi";
import { TransactionViewModel } from "common/models";

export function getDirectionColoring(item: TransactionViewModel): string {
    switch (item.direction) {
        case MoneyDirection.Income:
            return "table-success";
        case MoneyDirection.Plan:
            return "table-warning";
        default:
            return;
    }
}