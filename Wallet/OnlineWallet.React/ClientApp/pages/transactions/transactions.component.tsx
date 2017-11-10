import * as React from 'react';
import { TransactionTable, getDirectionColoring } from "common/transactions-view";
import { Transaction, transactionService } from 'walletApi';
import { bind } from 'walletCommon';
import { Layout } from 'layout';

export namespace Transactions {
    export interface Props {

    }

    export interface State {
        changedItems: Transaction[];
        items: Transaction[];
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
        const transactions = await transactionService.fetch();
        this.setState({
            items: transactions
        });
    }

    @bind
    private save() {

    }

    @bind
    private deleteItem(item: Transaction) {
        console.log("deleteItem", item, this);
        alert("deleteItem");
    }
    
    @bind
    private update(items: Transaction[], changedItems: Transaction[]): void {
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
                    items={this.state.items} rowModifier={getDirectionColoring}
                    deleted={this.deleteItem} update={this.update} />
            </Layout>
        );
    }
}