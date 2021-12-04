import { shallowEqual, useSelector } from "react-redux";
import { CellProps } from "react-table";
import { RootState } from "../../../services/reducers";
import { WalletsModel } from "../../../services/reducers/wallets/walletsReducers";
import { getWalletNameById } from "../../../services/helpers";

export function WalletCell<D extends object>({ value }: CellProps<D, number | undefined>) {
  const wallets = useSelector<RootState, WalletsModel>((e) => e.wallets, shallowEqual);
  return <>{getWalletNameById(value, wallets)}</>;
}
