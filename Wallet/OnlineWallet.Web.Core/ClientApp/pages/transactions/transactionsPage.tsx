import * as React from "react";
import * as moment from "moment";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";

import { AlertsActions } from "actions/alerts";
import { Transaction, transactionService, walletService, Wallet, BalanceInfo } from "walletApi";
import { bind, _ } from "helpers";
import { Layout } from "layout";
import { TransactionTable, getDirectionColoring, TransactionViewModel, mapTransactionViewModel, mapTransaction } from "walletCommon";
import { YearSelector, MonthSelector, Balance } from "./subComponents";
import { RootState } from "reducers";
import { Link } from "react-router-dom";

export namespace Transactions {
    export interface Params {
        year?: string;
        month?: string;
    }
    export interface Props extends Partial<RouteComponentProps<Params>> {
        wallets: Wallet[];
        actions?: typeof AlertsActions;
    }

    export interface State {
        changedItems: TransactionViewModel[];
        deletedItems: number[];
        items: TransactionViewModel[];
        month: number;
        year: number;
        maxYear: number;
        balance?: BalanceInfo;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export class Transactions extends React.Component<Transactions.Props, Transactions.State> {

    constructor(props) {
        super(props);
        const { year, month } = this.getYearMonth(props.match.params);
        this.state = {
            changedItems: [],
            deletedItems: [],
            items: [],
            year,
            month,
            maxYear: new Date().getFullYear()
        };
    }

    get alertsService() {
        return this.props.actions;
    }

    componentDidMount() {
        this.dateSelected();
    }

    componentWillReceiveProps(nextProps: Transactions.Props) {
        const { year, month } = this.getYearMonth(nextProps.match.params);
        if (this.state.year !== year || this.state.month !== month) {
            this.setState({ year, month }, this.dateSelected);
        }
    }

    getYearMonth(params: Transactions.Params) {
        const now = new Date();
        const year = parseInt(params.year, 10) || now.getFullYear();
        const month = parseInt(params.month, 10) || now.getMonth() + 1;
        return { year, month };
    }

    @bind
    async save() {
        try {
            this.alertsService.dismissAllAlert();
            if (this.state.changedItems.length === 0 && this.state.deletedItems.length === 0) {
                this.alertsService.showAlert({ type: "warning", message: "No data has changed." });
                return;
            }
            const transactions = mapTransaction(this.state.changedItems);
            const resultTransactions = await transactionService.batchUpdate(transactions, this.state.deletedItems);
            this.setState({
                changedItems: [],
                deletedItems: []
            });
            await this.dateSelected();
            this.alertsService.showAlert({ type: "success", message: "Changes saved successfully." });
        } catch (error) {
            this.alertsService.showAlert({ type: "danger", message: error });
        }
    }

    @bind
    deleteItem(item: TransactionViewModel) {
        this.setState((prevState, props) => {
            return {
                items: _.remove(prevState.items, item),
                changedItems: _.remove(prevState.changedItems, item),
                deletedItems: [...prevState.deletedItems, item.transactionId]
            };
        });
    }

    @bind
    update(items: TransactionViewModel[], changedItems: TransactionViewModel[]): void {
        this.setState({
            items,
            changedItems
        });
    }

    @bind
    async dateSelected() {
        const { year, month } = this.state;
        const start = moment([year, month - 1, 1]);
        const end = moment(start).endOf("month");
        const fetchTransactions = transactionService.fetch({
            search: `CreatedAt >= "${start.format("YYYY-MM-DD")}" And CreatedAt <= "${end.format("YYYY-MM-DD")}"`,
            sorting: "CreatedAt desc, Name asc, TransactionId desc"
        });
        const fetchBalance = transactionService.balanceInfo(start.year(), start.month() + 1);
        const [transactions, balance] = await Promise.all([fetchTransactions, fetchBalance]);
        this.setState({
            items: mapTransactionViewModel(transactions, this.props.wallets),
            balance
        });
    }

    render() {
        const { maxYear, items, changedItems, balance, year, month } = this.state;
        const { wallets } = this.props;
        return (
            <Layout>
                <form>
                    <div className="form-row">
                        <div className="col">
                            <button type="button" className="btn btn-success" onClick={this.save} name="saveBtn">Save</button>
                        </div>
                        <div className="col">
                            <MonthSelector year={year} month={month} />
                        </div>
                    </div>
                </form>
                <Balance balance={balance} />
                <TransactionTable changedItems={changedItems} wallets={wallets}
                    items={items} rowColor={getDirectionColoring}
                    deleted={this.deleteItem} update={this.update} />
            </Layout>
        );
    }
}

function mapStateToProps(state: RootState, ownProps: any) {
    return {
        wallets: state.wallets
    };
}

function mapDispatchToProps(dispatch, ownProps: any) {
    return {
        actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}
