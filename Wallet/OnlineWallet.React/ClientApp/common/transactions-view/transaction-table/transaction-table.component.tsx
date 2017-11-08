import * as React from "react";
import { Wallet, Transaction, walletService } from "walletApi";
import { TransactionViewModel, ITransactionTableExtFunction } from "../models";
import { ListHelpers, bindFunctions } from "walletCommon";
import { TransactionTableRow } from "./transaction-table-row.component";

export namespace TransactionTable {
  export interface Props {
    items: Transaction[];
    changedItems: Transaction[];
    rowModifier: ITransactionTableExtFunction;
    update(items: Transaction[], changedItems: Transaction[]): void;
    deleted(items: Transaction): void;
  }

  export interface State {
    wallets: Wallet[];
  }
}

@bindFunctions
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

  saveTransaction(newItem: Transaction, original: Transaction) {
    let items = ListHelpers.replace(this.props.items, newItem, original);
    let changes = ListHelpers.replace(this.props.changedItems, newItem, original, true);
    this.props.update(items, changes);
  }

  deleteTransaction(item: Transaction) {
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
              key={item.transactionId}
              item={item}
              wallets={this.state.wallets}
              deleteTransaction={this.deleteTransaction}
              rowModifier={this.props.rowModifier}
              saveTransaction={this.saveTransaction} />)}
        </tbody>
      </table>
    );
  }
}