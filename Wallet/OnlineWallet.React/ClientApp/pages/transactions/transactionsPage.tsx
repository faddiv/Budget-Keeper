import * as React from 'react';
import * as moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AlertsActions from "actions/alerts"
import { TransactionTable, getDirectionColoring } from "common/transactions-view";
import { Transaction, transactionService, walletService, Wallet, BalanceInfo } from 'walletApi';
import { bind, ListHelpers } from 'walletCommon';
import { Layout } from 'layout';
import { TransactionViewModel, mapTransactionViewModel, mapTransaction } from 'common/models';
import { YearSelector, MonthSelector, Balance } from './subComponents';
import { RootState } from 'reducers';

export namespace Transactions {
    export interface Props {
        wallets: Wallet[];
        actions?: typeof AlertsActions,
    }

    export interface State {
        changedItems: TransactionViewModel[];
        deletedItems: number[];
        items: TransactionViewModel[];
        selectedYear: number;
        selectedMonth: number;
        maxYear: number;
        balance?: BalanceInfo;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class Transactions extends React.Component<Transactions.Props, Transactions.State> {

    constructor(props) {
        super(props);
        const now = new Date();
        this.state = {
            changedItems: [],
            deletedItems: [],
            items: [],
            selectedYear: now.getFullYear(),
            selectedMonth: now.getMonth() + 1,
            maxYear: now.getFullYear()
        };
    }

    get alertsService() {
        return this.props.actions;
    }

    componentDidMount() {
        this.dateSelected(this.state.selectedYear, this.state.selectedMonth);
    }

    componentWillReceiveProps() {
        this.dateSelected(this.state.selectedYear, this.state.selectedMonth);
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
            this.setState({
                changedItems: [],
                deletedItems: []
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
                items: ListHelpers.remove(prevState.items, item),
                changedItems: ListHelpers.remove(prevState.changedItems, item),
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
        this.setState({
            selectedYear: year
        }, () => {
            this.dateSelected(this.state.selectedYear, this.state.selectedMonth);
        });
    }

    @bind
    private monthSelected(month: number) {
        this.setState({
            selectedMonth: month
        }, () => {
            this.dateSelected(this.state.selectedYear, this.state.selectedMonth);
        });
    }

    private async dateSelected(year: number, month: number) {
        const start = moment(year + "-" + month + "-01");
        const end = moment(start).endOf("month");
        var fetchTransactions = transactionService.fetch({
            search: `CreatedAt >= "${start.format("YYYY-MM-DD")}" And CreatedAt <= "${end.format("YYYY-MM-DD")}"`,
            sorting: "CreatedAt desc, Name asc, TransactionId desc"
        });
        var fetchBalance = transactionService.balanceInfo(start.year(), start.month());
        const [transactions, balance] = await Promise.all([fetchTransactions, fetchBalance]);
        this.setState({
            items: mapTransactionViewModel(transactions, this.props.wallets),
            balance: balance
        });
    }

    render() {
        const { maxYear, selectedYear, selectedMonth, items, changedItems, balance } = this.state;
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
                                <YearSelector from={2009} to={maxYear} year={selectedYear} onChange={this.yearSelected} />
                                <MonthSelector year={selectedYear} month={selectedMonth} onChange={this.monthSelected} />
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
