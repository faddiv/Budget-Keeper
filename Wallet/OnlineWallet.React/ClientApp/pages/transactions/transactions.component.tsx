import * as React from 'react';
import * as moment from 'moment';
import { TransactionTable, getDirectionColoring } from "common/transactions-view";
import { Transaction, transactionService, walletService } from 'walletApi';
import { bind, ListHelpers } from 'walletCommon';
import { Layout } from 'layout';
import { TransactionViewModel, mapTransactionViewModel, mapTransaction } from 'common/models';
import { YearSelector } from 'pages/transactions/yearSelector';
import { MonthSelector } from 'pages/transactions/monthSelector';

export namespace Transactions {
    export interface Props {

    }

    export interface State {
        changedItems: TransactionViewModel[];
        deletedItems: number[];
        items: TransactionViewModel[];
        selectedYear: number;
        selectedMonth: number;
        maxYear: number;
    }
}

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

    async componentDidMount() {

        var [transactions, wallets] = await Promise.all([transactionService.fetch(), walletService.getAll()]);
        var model = mapTransactionViewModel(transactions, wallets);
        this.setState({
            items: model
        });
    }

    @bind
    async save() {
        try {
            //this.alertsService.dismissAll();
            if (this.state.changedItems.length === 0 && this.state.deletedItems.length === 0) {
                //this.alertsService.warning("No data has changed.");
                return;
            }
            var transactions = mapTransaction(this.state.changedItems);
            var resultTransactions = await transactionService.batchUpdate(transactions, this.state.deletedItems);
            this.setState({
                changedItems: [],
                deletedItems: []
            });
            //this.alertsService.success("Changes saved successfully.");
        } catch (error) {
            //this.alertsService.error(error);
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
            this.dateSelected(this.state.selectedYear,this.state.selectedMonth);
        });
    }

    @bind
    private monthSelected(month: number) {
        this.setState({
            selectedMonth: month
        }, () => {
            this.dateSelected(this.state.selectedYear,this.state.selectedMonth);
        });
    }

    private async dateSelected(year: number, month: number) {
        const start = moment(year + "-" + month + "-01");
        const end = moment(start).endOf("month");
        const result = await transactionService.fetch({
            search: `createdAt >= "${start.format("YYYY-MM-DD")}" And createdAt <= "${start.format("YYYY-MM-DD")}"`
        });
        var wallets = await walletService.getAll();
        this.setState({
            items: mapTransactionViewModel(result, wallets)
        });
    }

    render() {
        const { maxYear, selectedYear, selectedMonth, items, changedItems } = this.state;
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
                <TransactionTable changedItems={changedItems}
                    items={items} rowColor={getDirectionColoring}
                    deleted={this.deleteItem} update={this.update} />
            </Layout>
        );
    }
}