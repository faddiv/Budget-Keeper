import * as React from "react";
import { Wallet, Transaction } from "walletApi";
import { TransactionViewModel, ITransactionTableExtFunction } from "../models";
import { ListHelpers } from "walletCommon";

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

  private directionCssClass(item: TransactionViewModel) {
    switch (item.direction) {
      case -1:
        return "glyphicon glyphicon-minus text-danger";
      case 1:
        return "glyphicon glyphicon-plus text-success";
      default:
        return "glyphicon glyphicon-bookmark";
    }
  }

  private changeDirection(item: TransactionViewModel) {

  }
  
  private renderEditRow(item: TransactionViewModel) {
    return (
      <tr className={item.cssClass}>
        <td><input type="date" className="form-control" value={item.createdAtText} name="createdAt" /></td>
        <td><input type="text" className="form-control" value={item.name} name="name" /></td>
        <td onClick={() => this.changeDirection(item)}>
          <span className={this.directionCssClass(item)}></span>
        </td>
        <td><input type="number" className="form-control" value={item.value} name="value" /></td>
        <td>
          <select className="form-control" value={item.walletId} name="walletId">
            {this.state.wallets.map(wallet =>
              <option value={wallet.moneyWalletId}>{wallet.name}</option>)}
          </select>
        </td>
        <td><input type="text" className="form-control" value={item.category} name="category" /></td>
        <td><input type="comment" className="form-control" value={item.comment} name="comment" /></td>
        <td>
          <button className="btn btn-danger btn-sm pull-right" type="button" onClick={item.cancel}>
            <span className="glyphicon glyphicon-remove"></span>
          </button>
          <button className="btn btn-success btn-sm pull-right" type="button" onClick={() => this.saveTransaction(item)}>
            <span className="glyphicon glyphicon-ok"></span>
          </button>
        </td>
      </tr>
    );
  }
  private renderViewRow(item: TransactionViewModel) {
    return (
      <tr className={item.cssClass}>
        <td>{item.createdAtText}</td>
        <td>{item.name}</td>
        <td>
          <span className={this.directionCssClass(item)}></span>
        </td>
        <td>{item.value}</td>
        <td>{item.walletName}</td>
        <td>{item.category}</td>
        <td>{item.comment}</td>
        <td>
          <button className="btn btn-danger btn-sm pull-right" type="button" onClick={() => this.deleteTransaction(item)}>
            <span className="glyphicon glyphicon-trash"></span>
          </button>
          <button className="btn btn-primary btn-sm pull-right" type="button" onClick={() => this.editTransaction(item)}>
            <span className="glyphicon glyphicon-edit"></span>
          </button>
        </td>
      </tr>
    );
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
          {this.state.pageItems.map(item => item.editMode ? this.renderEditRow(item) : this.renderViewRow(item))}
        </tbody>
      </table>
    );
  }
}