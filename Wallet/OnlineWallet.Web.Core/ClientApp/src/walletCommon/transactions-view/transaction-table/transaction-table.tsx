import { bindActionCreators } from "redux";
import { connect, shallowEqual, useDispatch, useSelector } from "react-redux";
import { bind } from "bind-decorator";

import { Wallet } from "../../../walletApi";
import { TransactionTableRow } from "./transaction-table-row";
import { TransactionViewModel, ITransactionTableExtFunction } from "../../../walletCommon";
import { _ } from "../../../helpers";
import { TransactionSummaryActions, TransactionSummaryViewModel } from "../../../actions/transactionsSummary";
import { RootState } from "../../../reducers";
import { AlertsActions } from "../../../actions/alerts";
import { Table } from "react-bootstrap";
import { Column, useTable } from "react-table";
import { Component, DetailedHTMLProps, HTMLAttributes, useCallback, useMemo, useState } from "react";
import cl from "classnames";
import { isClickableClicked } from "../../../react-ext";
import { useCellEditor } from "./useCellEditor";
import { WalletCell, ActionsCell, DirectionCell } from "./ViewCells";
import { createCellEditor, WalletEditor } from "./EditorCells";

type TableRowExt = Omit<DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>, "key">;
enum SelectMode {
  deselect,
  none,
  select,
}

export interface TransactionTableProps {
  summaryActions?: typeof TransactionSummaryActions;
  alertActions?: typeof AlertsActions;
  items: TransactionViewModel[];
  wallets: Wallet[];
  changedItems?: TransactionViewModel[];
  rowColor?: ITransactionTableExtFunction;
  transactionSummary?: TransactionViewModel[];
  update?(items: TransactionViewModel[], changedItems?: TransactionViewModel[]): void;
  deleted?(items: TransactionViewModel): void;
}

export interface TransactionTableState {
  selectMode: SelectMode;
}

export class TransactionTable2 extends Component<TransactionTableProps, TransactionTableState> {
  constructor(props: TransactionTableProps) {
    super(props);
    this.state = {
      selectMode: SelectMode.none,
    };
  }

  private getFromSummaryById(item: TransactionViewModel): TransactionViewModel | undefined {
    return this.props.transactionSummary?.find((ts) => {
      if (ts === item) {
        return true;
      }
      if (ts.transactionId && item.transactionId) {
        return ts.transactionId === item.transactionId;
      }
      return ts.key === item.key;
    });
  }

  componentWillReceiveProps(nextProps: Readonly<TransactionTableProps>) {
    if (this.props.items !== nextProps.items) {
      const newSelection = [];
      for (const newTransaction of nextProps.items) {
        const originalTransaction = this.getFromSummaryById(newTransaction);
        if (!originalTransaction) {
          continue;
        }
        newSelection.push(newTransaction);
      }
      this.props.summaryActions?.transactionsSelected(newSelection);
    }
  }

  @bind
  saveTransaction(newItem: TransactionViewModel, original: TransactionViewModel) {
    const items = _.replace(this.props.items, newItem, original);
    const changes = this.props.changedItems ? _.replace(this.props.changedItems, newItem, original, true) : undefined;
    this.props.update && this.props.update(items, changes);
  }

  @bind
  deleteTransaction(item: TransactionViewModel) {
    this.props.deleted && this.props.deleted(item);
  }

  @bind
  startSelection(item: TransactionViewModel) {
    this.setState((_prevState: TransactionTableState, props: TransactionTableProps) => {
      const selectMode = _.contains(props.transactionSummary || [], item) ? SelectMode.deselect : SelectMode.select;
      const selected = selectMode === SelectMode.select ? [...(props.transactionSummary || []), item] : _.remove(props.transactionSummary || [], item);
      props.summaryActions?.transactionsSelected(selected);
      return {
        selectMode,
        selected,
      };
    });
  }

  @bind
  selectingRow(item: TransactionViewModel) {
    if (this.state.selectMode === SelectMode.none) {
      return;
    }
    let selected: TransactionViewModel[] = [];
    if (this.state.selectMode === SelectMode.select) {
      if (!_.contains(this.props.transactionSummary || [], item)) {
        selected = [...(this.props.transactionSummary || []), item];
      }
    } else {
      if (_.contains(this.props.transactionSummary || [], item)) {
        selected = _.remove(this.props.transactionSummary || [], item);
      }
    }
    if (selected) {
      this.props.summaryActions?.transactionsSelected(selected);
    }
  }

  @bind
  endSelection() {
    this.setState({
      selectMode: SelectMode.none,
    });
  }

  @bind
  errorHandler(e: Error) {
    this.props.alertActions?.showAlert({ type: "danger", message: e.message });
  }

  render() {
    const { items, wallets, rowColor, transactionSummary, update } = this.props;
    const editable = !!update;
    return (
      <table className="table transactions" onMouseLeave={this.endSelection}>
        <thead>
          <tr>
            <th className="created-at">createdAt</th>
            <th className="name">name</th>
            <th className="direction">dir</th>
            <th className="price">price</th>
            <th className="wallet-name">walletName</th>
            <th className="category">category</th>
            <th>comment</th>
            {editable && <th className="commands"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <TransactionTableRow
              key={item.key}
              item={item}
              selected={_.contains(transactionSummary || [], item)}
              wallets={wallets}
              deleteTransaction={this.deleteTransaction}
              saveTransaction={this.saveTransaction}
              editable={editable}
              rowColor={rowColor}
              rowMouseDown={this.startSelection}
              rowMouseEnter={this.selectingRow}
              rowMouseUp={this.endSelection}
              onError={this.errorHandler}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    transactionSummary: state.transactionSummary,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    summaryActions: bindActionCreators(TransactionSummaryActions as any, dispatch) as typeof TransactionSummaryActions,
    alertActions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions,
  };
}

export const TransactionTable3 = connect(mapStateToProps, mapDispatchToProps)(TransactionTable2);

const DateEditor = createCellEditor("date");
const CommentEditor = createCellEditor("text");
const NumberEditor = createCellEditor("number");

export interface TransactionTableProps2 {
  items: TransactionViewModel[];
  changedItems?: TransactionViewModel[];
  rowColor?: ITransactionTableExtFunction;
  update?(items: TransactionViewModel[], changedItems?: TransactionViewModel[]): void;
  deleted?(items: TransactionViewModel): void;
}

export function TransactionTable({ items, changedItems, deleted, rowColor, update }: TransactionTableProps2) {
  const transactionSummary = useSelector<RootState, TransactionSummaryViewModel>((e) => e.transactionSummary, shallowEqual);
  const dispatch = useDispatch();
  const [selectMode, setSelectMode] = useState(SelectMode.none);

  const columns = useMemo<Column<TransactionViewModel>[]>(() => {
    return [
      {
        Header: "Created at",
        accessor: "createdAt",
        Editor: DateEditor,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Dir",
        accessor: "direction",
        Cell: DirectionCell,
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
  }, []);
  const submitCellHandler = useCallback(
    (original: TransactionViewModel, columnId: string, newValue: any) => {
      const newItem = { ...original, [columnId]: newValue };
      const newItems = _.replace(items, newItem, original);
      const changes = changedItems ? _.replace(changedItems, newItem, original, true) : undefined;
      update?.(newItems, changes);
    },
    [changedItems, items, update]
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
        {rows.map((row, i) => {
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

declare module "react-table" {
  interface TransactionTableOptions {
    transactionDelete?(items: TransactionViewModel): void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface TableOptions<D extends object> extends TransactionTableOptions {}
}
