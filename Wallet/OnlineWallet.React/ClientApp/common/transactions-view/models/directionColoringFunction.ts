import { MoneyDirection, Transaction } from "walletApi";

export function getDirectionColoring(item: Transaction): string {
    switch (item.direction) {
        case MoneyDirection.Income:
            return "table-success";
        case MoneyDirection.Plan:
            return "table-warning";
        default:
            return;
    }
}