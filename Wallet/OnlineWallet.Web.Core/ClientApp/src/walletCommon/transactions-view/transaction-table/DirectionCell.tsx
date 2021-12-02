import { CellProps } from "react-table";
import { MoneyDirection } from "../../../walletApi";
import { DirectionIcon } from "../../directionIcon";

export function DirectionCell<D extends object>({ value }: CellProps<D, MoneyDirection>) {
  
  return (
    <DirectionIcon direction={value || 0} />
  );
}
