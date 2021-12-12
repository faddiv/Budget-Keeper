import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AlertsActions } from "../../services/actions/alerts";
import { transactionService, BalanceInfo, statisticsService } from "../../services/walletApi";
import { toErrorMessage, _, getDirectionColoring, mapTransaction, mapTransactionViewModel, TransactionViewModel, dateFormatNew } from "../../services/helpers";
import { TransactionTable } from "../../components/TransactionTable";
import { MonthSelector, Balance } from "./components";
import { endOfMonth, format } from "date-fns";
import { Stack, Button, Col, Row } from "react-bootstrap";

export interface TransactionsParams {
  year?: string;
  month?: string;
}

export interface TransactionsState {
  changedItems: TransactionViewModel[];
  deletedItems: number[];
  transactions: TransactionViewModel[];
  balance: BalanceInfo | undefined;
}

export function TransactionPage() {
  const { year, month } = getYearMonth(useParams<TransactionsParams>());
  const dispatch = useDispatch();
  const [pageState, setPageState] = useState<TransactionsState>({
    changedItems: [],
    deletedItems: [],
    transactions: [],
    balance: undefined,
  });
  const { transactions, balance, changedItems, deletedItems } = pageState;

  const loadData = useCallback(async () => {
    try {
      const { transactions, balance } = await loadMonth(year, month);
      setPageState({
        transactions,
        changedItems: [],
        deletedItems: [],
        balance,
      });
    } catch (error) {
      dispatch(AlertsActions.showAlert({ type: "danger", message: toErrorMessage(error) }));
    }
  }, [dispatch, month, year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const update = useCallback((newItem: TransactionViewModel, original: TransactionViewModel) => {
    setPageState((prev) => ({
      ...prev,
      transactions: _.replace(prev.transactions, newItem, original),
      changedItems: _.replace(prev.changedItems, newItem, original, true),
    }));
  }, []);

  const deleteItem = useCallback((item: TransactionViewModel) => {
    const deletedId = item.transactionId;
    if (deletedId) {
      setPageState((prevState) => {
        return {
          ...prevState,
          items: _.remove(prevState.transactions, item),
          changedItems: _.remove(prevState.changedItems, item),
          deletedItems: [...prevState.deletedItems, deletedId],
        };
      });
    }
  }, []);

  const save = useCallback(async () => {
    try {
      dispatch(AlertsActions.dismissAllAlert());
      if (changedItems.length === 0 && deletedItems.length === 0) {
        dispatch(AlertsActions.showAlert({ type: "warning", message: "No data has changed." }));
        return;
      }
      const transactions = mapTransaction(changedItems);
      await transactionService.batchUpdate(transactions, deletedItems);
      setPageState((prev) => ({
        ...prev,
        changedItems: [],
        deletedItems: [],
      }));
      await loadData();
      dispatch(AlertsActions.showAlert({ type: "success", message: "Changes saved successfully." }));
    } catch (error) {
      dispatch(AlertsActions.showAlert({ type: "danger", message: toErrorMessage(error) }));
    }
  }, [changedItems, deletedItems, dispatch, loadData]);

  return (
    <Stack>
      <Row className="mb-3">
        <Col xs="auto">
          <Button variant="success" onClick={save}>
            Save
          </Button>
        </Col>
        <Col>
          <MonthSelector year={year} month={month} />
        </Col>
      </Row>
      <Balance balance={balance} />
      <TransactionTable items={transactions} rowColor={getDirectionColoring} deleted={deleteItem} update={update} />
    </Stack>
  );
}

function getYearMonth(params: TransactionsParams) {
  const now = new Date();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth() + 1;
  return { year, month };
}

async function loadMonth(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = endOfMonth(start);
  const fetchTransactions = transactionService.fetchDateRange(format(start, dateFormatNew), format(end, dateFormatNew));
  const fetchBalance = statisticsService.balanceInfo(year, month);
  const [transactions, balance] = await Promise.all([fetchTransactions, fetchBalance]);
  return { transactions: mapTransactionViewModel(transactions), balance };
}
