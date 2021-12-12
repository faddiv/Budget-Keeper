import { useCallback } from "react";
import { Table } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Column, useTable } from "react-table";
import { RootState } from "../../../services/reducers";
import { WalletsModel } from "../../../services/reducers/wallets/walletsReducers";
import { Wallet } from "../../../services/walletApi";
import { ActionsCell } from "./ActionsCell";
import { deleteWallet, updateWallet } from "../../../services/actions/wallets";
import { useCellEditor } from "../../../services/react-table-plugins";
import { createCellEditor } from "../../../components/TransactionTable/EditorCells";

export function WalletTable() {
  const wallets = useSelector<RootState, WalletsModel>((root) => root.wallets, shallowEqual);
  const dispatch = useDispatch();

  const updateRow = useCallback(
    (original: Wallet, cellId: string, value: any) => {
      dispatch(updateWallet({ ...original, [cellId]: value }));
    },
    [dispatch]
  );

  const deleteRow = useCallback(
    async (row: Wallet) => {
      if (!window.confirm("Are you sure deleting this item?")) {
        return;
      }
      await dispatch(deleteWallet(row));
    },
    [dispatch]
  );

  const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } = useTable<Wallet>(
    {
      columns,
      data: wallets,
      deleteRow: deleteRow,
      getRowId: (original) => original.moneyWalletId.toString(),
      editEnabled: true,
      submitCellHandler: updateRow,
    },
    useCellEditor
  );

  return (
    <Table {...getTableProps()} className="transactions">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render(cell.isEdited ? "Editor" : "Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

const NameEditor = createCellEditor("text");

const columns: Column<Wallet>[] = [
  {
    Header: "Id",
    accessor: "moneyWalletId",
  },
  {
    Header: "Name",
    accessor: "name",
    Editor: NameEditor,
  },
  {
    id: "cmd",
    Header: "",
    Cell: ActionsCell,
  },
];
