import { MoneyDirection } from "./MoneyDirection";

export interface ExportImportRow {
    created?: Date;

    name?: string;

    comment?: string;

    category?: string;

    amount?: number;

    source?: string;

    direction?: MoneyDirection;

    matchingId?: number;

}
