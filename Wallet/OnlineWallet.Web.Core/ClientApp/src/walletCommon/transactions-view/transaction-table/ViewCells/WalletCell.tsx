import { shallowEqual, useSelector } from "react-redux";
import { CellProps } from "react-table";
import { getWalletNameById } from "../../../models";
import { RootState } from "../../../../reducers";
import { WalletsModel } from "../../../../reducers/wallets/walletsReducers";

export function WalletCell<D extends object>({ value }: CellProps<D, number | undefined>) {
  const wallets = useSelector<RootState, WalletsModel>((e) => e.wallets, shallowEqual);
  return <>{getWalletNameById(value, wallets)}</>
}
