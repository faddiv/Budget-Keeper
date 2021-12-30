import { CellProps } from "react-table";
import { MoneyDirection } from "../../../services/walletApi";
import { DirectionIcon } from "../../MiniComponents/DirectionIcon";

export function DirectionCell<D extends object>({ value }: CellProps<D, MoneyDirection>) {
  return <DirectionIcon direction={value || 0} />;
}
