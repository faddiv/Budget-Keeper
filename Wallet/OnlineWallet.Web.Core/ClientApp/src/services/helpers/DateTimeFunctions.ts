import moment from "moment";

export const dateFormat = "YYYY-MM-DD";
export const dateFormatNew = "yyyy-MM-dd";
export function toDateString(dateTime: Date | undefined) {
    return toServerDate(moment(dateTime));
}

export function toServerDate(dateTime: moment.Moment) {
    return dateTime.format(dateFormat);
}

export function toUTCDate(value: any): Date | undefined {
    if (value) {
        const date = moment(value);
        return new Date(Date.UTC(date.year(), date.month(), date.date()));
    }
}
