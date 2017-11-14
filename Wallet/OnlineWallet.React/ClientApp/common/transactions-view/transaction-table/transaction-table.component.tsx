import * as React from "react";
import { Wallet, Transaction, walletService } from "walletApi";
import { ITransactionTableExtFunction } from "../models";
import { ListHelpers, bind } from "walletCommon";
import { TransactionTableRow } from "./transaction-table-row.component";
import { TransactionViewModel } from "common/models";

export namespace TransactionTable {
  export interface Props {
    items: TransactionViewModel[];
    changedItems?: TransactionViewModel[];
    rowModifier?: ITransactionTableExtFunction;
    update(items: TransactionViewModel[], changedItems?: TransactionViewModel[]): void;
    deleted(items: TransactionViewModel): void;
  }

  export interface State {
    wallets: Wallet[];
  }
}

export class TransactionTable extends React.Component<TransactionTable.Props, TransactionTable.State> {

  constructor(props: TransactionTable.Props) {
    super(props);
    this.state = {
      wallets: []
    };
  }

  componentDidMount() {
    walletService.getAll()
      .then(wallets => {
        this.setState({
          wallets: wallets
        });
      });
  }

  @bind
  saveTransaction(newItem: TransactionViewModel, original: TransactionViewModel) {
    let items = ListHelpers.replace(this.props.items, newItem, original);
    let changes = this.props.changedItems ? ListHelpers.replace(this.props.changedItems, newItem, original, true) : undefined;
    this.props.update(items, changes);
  }

  @bind
  deleteTransaction(item: TransactionViewModel) {
    this.props.deleted(item);
  }

  render() {
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
          {this.props.items.map(item =>
            <TransactionTableRow
              key={item.key}
              item={item}
              wallets={this.state.wallets}
              deleteTransaction={this.deleteTransaction}
              saveTransaction={this.saveTransaction} />)}
        </tbody>
      </table>
    );
  }
}