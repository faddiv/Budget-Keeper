import { endOfMonth, format } from "date-fns";
import { dateFormatNew } from "../../../helpers";

export interface ExportPageState {
  rangeType: string;
  rangeFrom: string;
  rangeTo: string;
  file: string;
  year: string;
  month: string;
}

export const rangeTypes = [
  {
    value: "1",
    name: "Year/Month",
  },
  {
    value: "2",
    name: "From-To",
  },
];

export function getRangeSelection(state: ExportPageState) {
  const { rangeFrom, rangeTo, rangeType, month, year } = state;
  if (rangeType === "1") {
    const from = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return {
      rangeFrom: format(from, dateFormatNew),
      rangeTo: format(endOfMonth(from), dateFormatNew),
    };
  }
  return { rangeFrom, rangeTo };
}
