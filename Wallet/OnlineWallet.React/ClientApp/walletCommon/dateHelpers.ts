import * as moment from "moment";
import 'moment/locale/hu';

export function toUTCDate(value: any): Date | undefined {
    if (value) {
        const date = moment(value);
        return new Date(Date.UTC(date.year(), date.month(), date.date()));
    }
}
