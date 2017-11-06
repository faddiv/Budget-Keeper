import * as React from "react";
import { Transaction, Wallet } from "walletApi";
import { ITransactionTableExtFunction, TransactionViewModel } from "common/transactions-view/models";

export namespace TransactionTableRow {
    export interface Props {
        item: TransactionViewModel;
        wallets: Wallet[];
        rowModifier: ITransactionTableExtFunction;
        saveTransaction(item: TransactionViewModel): void;
        deleteTransaction(item: TransactionViewModel): void;
    }

    export interface State {
        editMode: boolean;
    }
}

export class TransactionTableRow extends React.Component<TransactionTableRow.Props, TransactionTableRow.State> {

    constructor(props: TransactionTableRow.Props) {
        super(props);
        this.state = {
            editMode: false
        };
        this.changeDirection = this.changeDirection.bind(this);
        this.saveTransaction = this.saveTransaction.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.editTransaction = this.editTransaction.bind(this);
    }

    private directionCssClass() {
        switch (this.props.item.direction) {
            case -1:
                return "glyphicon glyphicon-minus text-danger";
            case 1:
                return "glyphicon glyphicon-plus text-success";
            default:
                return "glyphicon glyphicon-bookmark";
        }
    }

    private changeDirection() {

    }

    private saveTransaction() {
    }

    private deleteTransaction() {
    }

    private editTransaction() {
        this.setState((prevState, props) => ({
            editMode: !prevState.editMode
        }));
    }
    
    private cancelTransaction() {
        this.setState((prevState, props) => ({
            editMode: !prevState.editMode
        }));
    }

    render() {
        return this.state.editMode ? this.renderEditRow() : this.renderViewRow();
    }

    private renderEditRow() {
        return (
            <tr className={this.props.item.cssClass}>
                <td><input type="date" className="form-control" value={this.props.item.createdAtText} name="createdAt" /></td>
                <td><input type="text" className="form-control" value={this.props.item.name} name="name" /></td>
                <td onClick={this.changeDirection}>
                    <span className={this.directionCssClass()}></span>
                </td>
                <td><input type="number" className="form-control" value={this.props.item.value} name="value" /></td>
                <td>
                    <select className="form-control" value={this.props.item.walletId} name="walletId">
                        {this.props.wallets.map(wallet =>
                            <option value={wallet.moneyWalletId}>{wallet.name}</option>)}
                    </select>
                </td>
                <td><input type="text" className="form-control" value={this.props.item.category} name="category" /></td>
                <td><input type="comment" className="form-control" value={this.props.item.comment} name="comment" /></td>
                <td>
                    <button className="btn btn-danger btn-sm pull-right" type="button" onClick={this.props.item.cancel}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                    <button className="btn btn-success btn-sm pull-right" type="button" onClick={this.saveTransaction}>
                        <span className="glyphicon glyphicon-ok"></span>
                    </button>
                </td>
            </tr>
        );
    }

    private renderViewRow() {
        return (
            <tr className={this.props.item.cssClass}>
                <td>{this.props.item.createdAtText}</td>
                <td>{this.props.item.name}</td>
                <td>
                    <span className={this.directionCssClass()}></span>
                </td>
                <td>{this.props.item.value}</td>
                <td>{this.props.item.walletName}</td>
                <td>{this.props.item.category}</td>
                <td>{this.props.item.comment}</td>
                <td>
                    <button className="btn btn-danger btn-sm pull-right" type="button" onClick={this.deleteTransaction}>
                        <span className="glyphicon glyphicon-trash"></span>
                    </button>
                    <button className="btn btn-primary btn-sm pull-right" type="button" onClick={this.editTransaction}>
                        <span className="glyphicon glyphicon-edit"></span>
                    </button>
                </td>
            </tr>
        );
    }
}