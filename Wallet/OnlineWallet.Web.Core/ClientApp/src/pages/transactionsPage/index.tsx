import * as React from "react";
import moment from "moment";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bind } from "bind-decorator";

import { AlertsActions } from "../../services/actions/alerts";
import { transactionService, BalanceInfo, statisticsService } from "../../services/walletApi";
import { toErrorMessage, _, getDirectionColoring, mapTransaction, mapTransactionViewModel, TransactionViewModel } from "../../services/helpers";
import { TransactionTable } from "../../components/TransactionTable";
import { MonthSelector, Balance } from "./components";

export interface TransactionsParams {
  year?: string;
  month?: string;
}

export interface TransactionsProps extends Partial<RouteComponentProps<TransactionsParams>> {
  actions?: typeof AlertsActions;
}

export interface TransactionsState {
  changedItems: TransactionViewModel[];
  deletedItems: number[];
  items: TransactionViewModel[];
  month: number;
  year: number;
  balance?: BalanceInfo;
}

class Transactions2 extends React.Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    const { year, month } = this.getYearMonth(props.match?.params);
    this.state = {
      changedItems: [],
      deletedItems: [],
      items: [],
      year,
      month,
    };
  }

  get alertsService() {
    return this.props.actions;
  }

  componentDidMount() {
    this.dateSelected();
  }

  componentWillReceiveProps(nextProps: TransactionsProps) {
    const { year, month } = this.getYearMonth(nextProps.match?.params);
    if (this.state.year !== year || this.state.month !== month) {
      this.setState({ year, month }, this.dateSelected);
    }
  }

  getYearMonth(params: TransactionsParams | undefined) {
    const now = new Date();
    const year = params?.year ? parseInt(params.year, 10) : now.getFullYear();
    const month = params?.month ? parseInt(params.month, 10) : now.getMonth() + 1;
    return { year, month };
  }

  @bind
  async save() {
    try {
      this.alertsService?.dismissAllAlert();
      if (this.state.changedItems.length === 0 && this.state.deletedItems.length === 0) {
        this.alertsService?.showAlert({ type: "warning", message: "No data has changed." });
        return;
      }
      const transactions = mapTransaction(this.state.changedItems);
      await transactionService.batchUpdate(transactions, this.state.deletedItems);
      this.setState({
        changedItems: [],
        deletedItems: [],
      });
      await this.dateSelected();
      this.alertsService?.showAlert({ type: "success", message: "Changes saved successfully." });
    } catch (error) {
      this.alertsService?.showAlert({ type: "danger", message: toErrorMessage(error) });
    }
  }

  @bind
  deleteItem(item: TransactionViewModel) {
    const deletedId = item.transactionId;
    if (deletedId) {
      this.setState((prevState) => {
        return {
          items: _.remove(prevState.items, item),
          changedItems: _.remove(prevState.changedItems, item),
          deletedItems: [...prevState.deletedItems, deletedId],
        };
      });
    }
  }

  @bind
  update(newItem: TransactionViewModel, original: TransactionViewModel): void {
    const items = _.replace(this.state.items, newItem, original);
    const changedItems = _.replace(this.state.changedItems, newItem, original, true);
    this.setState({
      items,
      changedItems,
    });
  }

  @bind
  async dateSelected() {
    try {
      const { year, month } = this.state;
      const start = moment([year, month - 1, 1]);
      const end = moment(start).endOf("month");
      const fetchTransactions = transactionService.fetchDateRange(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
      const fetchBalance = statisticsService.balanceInfo(start.year(), start.month() + 1);
      const [transactions, balance] = await Promise.all([fetchTransactions, fetchBalance]);
      this.setState({
        items: mapTransactionViewModel(transactions),
        balance,
      });
    } catch (error) {
      this.alertsService?.showAlert({ type: "danger", message: toErrorMessage(error) });
    }
  }

  render() {
    const { items, balance, year, month } = this.state;
    return (
      <>
        <form>
          <div className="form-row">
            <div className="col">
              <button type="button" className="btn btn-success" onClick={this.save} name="saveBtn">
                Save
              </button>
            </div>
            <div className="col">
              <MonthSelector year={year} month={month} />
            </div>
          </div>
        </form>
        <Balance balance={balance} />
        <TransactionTable items={items} rowColor={getDirectionColoring} deleted={this.deleteItem} update={this.update} />
      </>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions,
  };
}

export const Transactions = connect(undefined, mapDispatchToProps)(Transactions2);
