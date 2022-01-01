import { endOfMonth } from "date-fns";
import { toDateString } from "../../../services/helpers";

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
      rangeFrom: toDateString(from),
      rangeTo: toDateString(endOfMonth(from)),
    };
  }
  return { rangeFrom, rangeTo };
}
