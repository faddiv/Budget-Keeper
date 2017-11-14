import * as React from 'react';
import { TransactionTable, getDirectionColoring } from "common/transactions-view";
import { Transaction, transactionService, walletService } from 'walletApi';
import { bind, ListHelpers } from 'walletCommon';
import { Layout } from 'layout';
import { TransactionViewModel, mapTransactionViewModel, mapTransaction } from 'common/models';

export namespace Transactions {
    export interface Props {

    }

    export interface State {
        changedItems: TransactionViewModel[];
        deletedItems: number[];
        items: TransactionViewModel[];
    }
}

export class Transactions extends React.Component<Transactions.Props, Transactions.State> {

    constructor(props) {
        super(props);
        this.state = {
            changedItems: [],
            deletedItems: [],
            items: []
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

    render() {
        return (
            <Layout>
                <form className="form-inline">
                    <button type="button" className="btn btn-success" onClick={this.save} name="saveBtn">Save</button>
                </form>
                <TransactionTable changedItems={this.state.changedItems}
                    items={this.state.items} rowColor={getDirectionColoring}
                    deleted={this.deleteItem} update={this.update} />
            </Layout>
        );
    }
}