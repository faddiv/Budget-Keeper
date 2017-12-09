import * as React from 'react';
import * as moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import * as AlertsActions from "actions/alerts"
import { Transaction, transactionService, walletService, Wallet, BalanceInfo } from 'walletApi';
import { bind, _ } from 'helpers';
import { Layout } from 'layout';
import { TransactionTable, getDirectionColoring, TransactionViewModel, mapTransactionViewModel, mapTransaction } from "walletCommon";
import { YearSelector, MonthSelector, Balance } from './subComponents';
import { RootState } from 'reducers';

export namespace Transactions {
    export interface Params {
        year?: string;
        month?: string;
    }
    export interface Props extends Partial<RouteComponentProps<Params>> {
        wallets: Wallet[];
        actions?: typeof AlertsActions,
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

    private getYearMonth(params: Transactions.Params) {
        const now = new Date();
        const year = parseInt(params.year) || now.getFullYear();
        const month = parseInt(params.month) || now.getMonth() + 1;
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
            var transactions = mapTransaction(this.state.changedItems);
            var resultTransactions = await transactionService.batchUpdate(transactions, this.state.deletedItems);
            var balance = await transactionService.balanceInfo(this.state.year, this.state.month);
            this.setState({
                changedItems: [],
                deletedItems: [],
                balance: balance
            });
            this.alertsService.showAlert({ type: "success", message: "Changes saved successfully." });
        } catch (error) {
            this.alertsService.showAlert({ type: "danger", message: error });
        }
    }

    @bind
    private deleteItem(item: TransactionViewModel) {
        this.setState((prevState, props) => {
            return {
                items: _.remove(prevState.items, item),
                changedItems: _.remove(prevState.changedItems, item),
                deletedItems: [...prevState.deletedItems, item.transactionId]
            };
        });
    }

    @bind
    private update(items: TransactionViewModel[], changedItems: TransactionViewModel[]): void {
        this.setState({
            items: items,
            changedItems: changedItems
        });
    }

    @bind
    private yearSelected(year) {
        this.props.history.push(`/transactions/${year}/${this.state.month}`);
    }

    @bind
    private monthSelected(month: number) {
        this.props.history.push(`/transactions/${this.state.year}/${month}`);
    }

    @bind
    private async dateSelected() {
        const { year, month } = this.state;
        const start = moment([year, month - 1, 1]);
        const end = moment(start).endOf("month");
        var fetchTransactions = transactionService.fetch({
            search: `CreatedAt >= "${start.format("YYYY-MM-DD")}" And CreatedAt <= "${end.format("YYYY-MM-DD")}"`,
            sorting: "CreatedAt desc, Name asc, TransactionId desc"
        });
        var fetchBalance = transactionService.balanceInfo(start.year(), start.month() + 1);
        const [transactions, balance] = await Promise.all([fetchTransactions, fetchBalance]);
        this.setState({
            items: mapTransactionViewModel(transactions, this.props.wallets),
            balance: balance
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
                            <div className="input-group">
                                <YearSelector from={2009} to={maxYear} year={year} onChange={this.yearSelected} />
                                <MonthSelector year={year} month={month} onChange={this.monthSelected} />
                            </div>
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
