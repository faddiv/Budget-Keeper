import * as moment from "moment";

export function toUTCDate(value: any): Date | undefined {
    if (value) {
        const date = moment(value);
        return new Date(Date.UTC(date.year(), date.month(), date.date()));
    }
}
