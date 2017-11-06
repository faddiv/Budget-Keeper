import * as React from "react";
import { Wallet, Transaction } from "walletApi";
import { TransactionViewModel, ITransactionTableExtFunction } from "../models";
import { ListHelpers } from "walletCommon";
import { TransactionTableRow } from "./transaction-table-row.component";

export namespace TransactionTable {
  export interface Props {
    items: Transaction[];
    changedItems: Transaction[];
    rowModifier: ITransactionTableExtFunction;
    deleted(item: TransactionViewModel): void;
  }

  export interface State {
    wallets: Wallet[];
    pageItems: TransactionViewModel[];
  }
}

export class TransactionTable extends React.Component<TransactionTable.Props, TransactionTable.State> {
  saveTransaction(item: TransactionViewModel) {
    for (const key in item.original) {
      if (item.original.hasOwnProperty(key)) {
        if (item.original[key] !== item[key]) {
          item.original[key] = item[key];
          item.changed = true;
        }
      }
    }
    this.setWalletName(item);
    item.editMode = false;
    if (this.props.changedItems) {
      const changes = this.state.pageItems.filter(val => val.changed);
      for (let index = 0; index < changes.length; index++) {
        const cangedItem = changes[index];
        if (this.props.changedItems.findIndex(e => e === cangedItem.original) === -1) {
          this.props.changedItems.push(cangedItem.original);
        }
      }
    }
  }
  editTransaction(item: TransactionViewModel) {
    item.editMode = !item.editMode;
  }

  deleteTransaction(item: TransactionViewModel) {
    this.props.deleted(item);
  }

  private setWalletName(item: TransactionViewModel) {
    item.walletName = ListHelpers.selectMap<Wallet, string>(this.state.wallets, w => w.moneyWalletId === item.walletId, w => w.name);
  }

  render() {
    return (
      <table className="table">
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
          {this.state.pageItems.map(item => 
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