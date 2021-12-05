import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TransactionSummaryActions, TransactionSummaryViewModel } from "../../services/actions/transactionsSummary";
import { RootState } from "../../services/reducers";
import { Table } from "react-bootstrap";
import { Column, useTable } from "react-table";
import { DetailedHTMLProps, HTMLAttributes, useCallback, useState } from "react";
import cl from "classnames";
import { isClickableClicked, _ } from "../../services/helpers";
import { useCellEditor } from "../../services/hooks";
import { WalletCell, ActionsCell, DirectionCell } from "./ViewCells";
import { CategoryEditor, createCellEditor, DirectionEditor, NameEditor, WalletEditor } from "./EditorCells";
import { ITransactionTableExtFunction, TransactionViewModel } from "../../services/helpers";

type TableRowExt = Omit<DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>, "key">;
enum SelectMode {
  deselect,
  none,
  select,
}

const DateEditor = createCellEditor("date");
const CommentEditor = createCellEditor("text");
const NumberEditor = createCellEditor("number");

export interface TransactionTableProps {
  items: TransactionViewModel[];
  rowColor?: ITransactionTableExtFunction;
  update?(newItem: TransactionViewModel, oldItem: TransactionViewModel): void;
  deleted?(items: TransactionViewModel): void;
}

export function TransactionTable({ items, deleted, rowColor, update }: TransactionTableProps) {
  const transactionSummary = useSelector<RootState, TransactionSummaryViewModel>((e) => e.transactionSummary, shallowEqual);
  const dispatch = useDispatch();
  const [selectMode, setSelectMode] = useState(SelectMode.none);

  const submitCellHandler = useCallback(
    (original: TransactionViewModel, columnId: string, newValue: any) => {
      const newItem = { ...original, [columnId]: newValue };
      update?.(newItem, original);
    },
    [update]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: items,
      getRowId: (original) => original.key?.toString() || "",
      editEnabled: true,
      submitCellHandler,
      transactionDelete: deleted,
    },
    useCellEditor
  );
  const getRowProps = useCallback(
    (row: TransactionViewModel, selectMode: SelectMode, transactionSummary: TransactionSummaryViewModel) => {
      const coloring = rowColor && rowColor(row);
      const selected = _.contains(transactionSummary, row);
      return {
        className: cl(coloring, { selected }),
        onMouseDown: (event) => {
          if (event.isDefaultPrevented() || isClickableClicked(event)) {
            return;
          }
          const selectMode = selected ? SelectMode.deselect : SelectMode.select;
          const selectedRows = selectMode === SelectMode.select ? [...transactionSummary, row] : _.remove(transactionSummary, row);
          dispatch(TransactionSummaryActions.transactionsSelected(selectedRows));
          setSelectMode(selectMode);
          event.preventDefault();
        },
        onMouseEnter: (event) => {
          if (event.isDefaultPrevented() || isClickableClicked(event)) {
            return;
          }
          if (selectMode === SelectMode.none) return selectMode;

          let selectedRows: TransactionViewModel[] | undefined = undefined;
          if (selectMode === SelectMode.select) {
            if (!_.contains(transactionSummary, row)) {
              selectedRows = [...transactionSummary, row];
            }
          } else {
            if (_.contains(transactionSummary, row)) {
              selectedRows = _.remove(transactionSummary, row);
            }
          }
          if (selectedRows) {
            dispatch(TransactionSummaryActions.transactionsSelected(selectedRows));
          }
        },
        onMouseUp: (event) => {
          if (event.isDefaultPrevented() || isClickableClicked(event)) {
            return;
          }
          setSelectMode(SelectMode.none);
        },
      } as TableRowExt;
    },
    [dispatch, rowColor]
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
            <tr {...row.getRowProps(getRowProps(row.original, selectMode, transactionSummary))}>
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

const columns: Column<TransactionViewModel>[] = [
  {
    Header: "Created at",
    accessor: "createdAt",
    Editor: DateEditor,
  },
  {
    Header: "Name",
    accessor: "name",
    Editor: NameEditor,
  },
  {
    Header: "Dir",
    accessor: "direction",
    Cell: DirectionCell,
    Editor: DirectionEditor,
  },
  {
    Header: "Price",
    accessor: "price",
    Editor: NumberEditor,
  },
  {
    Header: "Wallet",
    accessor: "walletId",
    Cell: WalletCell,
    Editor: WalletEditor,
  },
  {
    Header: "Category",
    accessor: "category",
    Editor: CategoryEditor,
  },
  {
    Header: "Comment",
    accessor: "comment",
    Editor: CommentEditor,
  },
  {
    accessor: "key",
    Header: "",
    Cell: ActionsCell,
  },
];

declare module "react-table" {
  interface TransactionTableOptions {
    transactionDelete?(items: TransactionViewModel): void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface TableOptions<D extends object> extends TransactionTableOptions {}
}
