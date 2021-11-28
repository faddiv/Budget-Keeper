import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { RootState } from "../../../reducers";
import { TransactionViewModel } from "../../models";
import { TransactionSummaryActions, TransactionSummaryViewModel } from "../../../actions/transactionsSummary";
import { MoneyDirection } from "../../../walletApi";
import { Button } from "react-bootstrap";
import { useCallback, useEffect } from "react";
import styles from "./transaction-summary.module.scss";
import cl from "classnames";

function sumPrice(items: TransactionSummaryViewModel, dir: MoneyDirection): number {
  let sum: number = 0;
  for (const element of items) {
    if (element.direction === dir) {
      sum += element.price ? parseInt(element.price, 10) : 0;
    }
  }
  return sum;
}

export function TransactionSummary() {
  const transactionSummary = useSelector<RootState, TransactionViewModel[]>((e) => e.transactionSummary, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();
  const closeHandler = useCallback(() => {
    dispatch(TransactionSummaryActions.transactionsSelected([]));
  }, [dispatch]);
  useEffect(() => {
    const destroy = history.listen(() => {
      closeHandler();
    });
    return destroy;
  }, [closeHandler, history]);
  if (transactionSummary.length === 0) {
    return null;
  }
  const expenses = sumPrice(transactionSummary, MoneyDirection.Expense);
  const incomes = sumPrice(transactionSummary, MoneyDirection.Income);
  const plans = sumPrice(transactionSummary, MoneyDirection.Plan);

  return (
    <div className={cl(styles.summary, "bg-light")}>
      <div>
        <span>Expenses: {expenses}</span>&nbsp;
        <span>Incomes: {incomes}</span>&nbsp;
        <span>Plans: {plans}</span>
      </div>
      <Button variant="outline-secondary" className="pull-right" aria-label="Close" onClick={closeHandler}>
        <span aria-hidden="true">&times;</span>
      </Button>
    </div>
  );
}
