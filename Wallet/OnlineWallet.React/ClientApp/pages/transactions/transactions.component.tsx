import * as React from 'react';
import { TransactionTable, getDirectionColoring } from "common/transactions-view";
import { Transaction, transactionService, walletService } from 'walletApi';
import { bind } from 'walletCommon';
import { Layout } from 'layout';
import { TransactionViewModel, mapTransactionViewModel } from 'common/models';

export namespace Transactions {
    export interface Props {

    }

    export interface State {
        changedItems: TransactionViewModel[];
        items: TransactionViewModel[];
    }
}

export class Transactions extends React.Component<Transactions.Props, Transactions.State> {

    constructor(props) {
        super(props);
        this.state = {
            changedItems: [],
            items: []
        };
    }

    async componentDidMount() {
        
        var [ transactions, wallets ] = await Promise.all([transactionService.fetch(), walletService.getAll()]);
        var model = mapTransactionViewModel(transactions, wallets);
        this.setState({
            items: model
        });
    }

    @bind
    private save() {

    }

    @bind
    private deleteItem(item: TransactionViewModel) {
        console.log("deleteItem", item, this);
        alert("deleteItem");
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
                    items={this.state.items}  rowColor={getDirectionColoring}
                    deleted={this.deleteItem} update={this.update} />
            </Layout>
        );
    }
}