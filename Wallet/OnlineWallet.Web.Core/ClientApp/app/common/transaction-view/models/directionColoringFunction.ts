
import { TransactionViewModel } from "./TransactionViewModel";

export function directionColoringFunction(item: TransactionViewModel) {
    item.cssClass = item.direction == 1 ? "success" : undefined;
}