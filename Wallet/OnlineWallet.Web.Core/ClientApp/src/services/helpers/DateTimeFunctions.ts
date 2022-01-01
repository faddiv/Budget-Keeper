import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd";

export function toDateString(dateTime: Date | string | undefined) {
    if(!dateTime) {
      return ""
    } else if(typeof dateTime === "string") {
      const tIndex = dateTime.indexOf("T");
      if(tIndex === -1){
        return dateTime;
      }else {
        return dateTime.slice(0, tIndex);
      }
    } else {
      return dateTime ? format(dateTime, dateFormat) : "";
    }
}

export function toUTCDate(value: any): Date | undefined {
    if (value) {
      if(value instanceof Date) {
        return value;
      }
      if(typeof value === "string"){
        return parse(value, dateFormat, new Date());
      }
      if(typeof value === "number") {
        return new Date(value);
      }
      console.error("Unknown data type. Can't parse to date.", value);
    }
}

export function toMonthNumber(value: Date) {
  return format(value, "MM");
}

export function toMonthName(value: Date) {
  return format(value, "MMM");
}
