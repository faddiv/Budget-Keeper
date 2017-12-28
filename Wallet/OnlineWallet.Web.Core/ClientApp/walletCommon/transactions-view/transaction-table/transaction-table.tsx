import * as React from "react";
import "./transaction-table.scss";
import { Wallet, Transaction, walletService } from "walletApi";
import { TransactionTableRow } from "./transaction-table-row";
import { TransactionViewModel, ITransactionTableExtFunction } from "walletCommon";
import { bind, _ } from "helpers";

export namespace TransactionTable {
    export interface Props {
        items: TransactionViewModel[];
        wallets: Wallet[];
        changedItems?: TransactionViewModel[];
        rowColor?: ITransactionTableExtFunction;
        update(items: TransactionViewModel[], changedItems?: TransactionViewModel[]): void;
        deleted(items: TransactionViewModel): void;
    }

    export interface State {
    }
}

export class TransactionTable extends React.Component<TransactionTable.Props, TransactionTable.State> {

    constructor(props: TransactionTable.Props) {
        super(props);
        this.state = {
        };
    }

    @bind
    saveTransaction(newItem: TransactionViewModel, original: TransactionViewModel) {
        const items = _.replace(this.props.items, newItem, original);
        const changes = this.props.changedItems ? _.replace(this.props.changedItems, newItem, original, true) : undefined;
        this.props.update(items, changes);
    }

    @bind
    deleteTransaction(item: TransactionViewModel) {
        this.props.deleted(item);
    }

    render() {
        const { items, wallets, rowColor } = this.props;
        return (
            <table className="table transactions">
                <thead>
                    <tr>
                        <th className="created-at">createdAt</th>
                        <th className="name">name</th>
                        <th className="direction">dir</th>
                        <th className="price">price</th>
                        <th className="wallet-name">walletName</th>
                        <th className="category">category</th>
                        <th>comment</th>
                        <th className="commands"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item =>
                        <TransactionTableRow
                            key={item.key}
                            item={item}
                            wallets={wallets}
                            deleteTransaction={this.deleteTransaction}
                            saveTransaction={this.saveTransaction}
                            rowColor={rowColor} />)}
                </tbody>
            </table>
        );
    }
}
