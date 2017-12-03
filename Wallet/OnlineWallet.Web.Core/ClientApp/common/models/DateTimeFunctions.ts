import * as moment from "moment";

export const dateFormat = "YYYY-MM-DD";
export function toDateString(dateTime:Date) {
    return moment(dateTime).format(dateFormat);
}