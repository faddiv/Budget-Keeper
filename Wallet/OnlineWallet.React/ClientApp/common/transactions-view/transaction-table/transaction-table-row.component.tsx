import * as React from "react";
import { Transaction, Wallet, MoneyDirection } from "walletApi";
import { ITransactionTableExtFunction, TransactionViewModel } from "common/transactions-view/models";
import { ListHelpers } from "walletCommon";
import { EditDelete, SaveCancel } from "common/misc";

export namespace TransactionTableRow {
    export interface Props {
        item: Transaction;
        wallets: Wallet[];
        rowModifier: ITransactionTableExtFunction;
        saveTransaction(newItem: Transaction, originalItem: Transaction): void;
        deleteTransaction(item: Transaction): void;
    }

    export interface State {
        editMode: boolean;
        item: TransactionViewModel;
    }
}

export class TransactionTableRow extends React.Component<TransactionTableRow.Props, TransactionTableRow.State> {

    constructor(props: TransactionTableRow.Props) {
        super(props);
        this.state = {
            editMode: false,
            item: this.createTransactionViewModel(props.item)
        };
        this.changeDirection = this.changeDirection.bind(this);
        this.cancelTransaction = this.cancelTransaction.bind(this);
        this.saveTransaction = this.saveTransaction.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.editTransaction = this.editTransaction.bind(this);
    }

    componentWillReceiveProps(nextProps: Readonly<TransactionTableRow.Props>) {
        if (this.state.item.original !== nextProps.item) {
            this.setState({
                item: this.createTransactionViewModel(nextProps.item)
            });
        }
    }

    private createTransactionViewModel(original: Transaction, modifications?: any) {
        var model = new TransactionViewModel(original);
        model.walletName = this.getWalletName(model);
        this.props.rowModifier(model);
        if (modifications) {
            Object.assign(model, modifications);
        }
        return model;
    }

    private directionCssClass() {
        switch (this.state.item.direction) {
            case -1:
                return "fa fa-minus text-danger";
            case 1:
                return "fa fa-plus text-success";
            default:
                return "fa fa-bookmark";
        }
    }

    private getWalletName(item: TransactionViewModel) {
        return ListHelpers.selectMap<Wallet, string>(this.props.wallets, w => w.moneyWalletId === item.walletId, w => w.name);
    }

    private changeDirection() {
        this.setState((prevState, props) => {
            var model = this.createTransactionViewModel(prevState.item.original, {
                direction: this.nextDirection(prevState.item.direction)
            });
            return {
                item: model
            };
        })
    }

    private nextDirection(direction: MoneyDirection) {
        switch (direction) {
            case MoneyDirection.Expense:
                return MoneyDirection.Income;
            case MoneyDirection.Income:
                return MoneyDirection.Plan;
            case MoneyDirection.Plan:
                return MoneyDirection.Expense;
        }
    }

    private saveTransaction() {
        var newTransaction = this.newOriginal(this.state.item);
        this.props.saveTransaction(newTransaction, this.state.item.original);
        this.setState({
            editMode: false
        });
    }

    private newOriginal(item: TransactionViewModel): Transaction {
        var original: any = {};
        for (const key in item.original) {
            if (item.original.hasOwnProperty(key)) {
                original[key] = item[key];
            }
        }
        return original;
    }

    private deleteTransaction() {
        this.props.deleteTransaction(this.state.item.original);
    }

    private editTransaction() {
        this.setState((prevState, props) => ({
            editMode: true
        }));
    }

    private cancelTransaction() {
        this.setState((prevState, props) => ({
            editMode: false,
            item: this.createTransactionViewModel(props.item)
        }));
    }

    render() {
        return this.state.editMode ? this.renderEditRow() : this.renderViewRow();
    }

    private renderEditRow() {
        return (
            <tr className={this.state.item.cssClass}>
                <td><input type="date" className="form-control" value={this.state.item.createdAtText} name="createdAt" /></td>
                <td><input type="text" className="form-control" value={this.state.item.name} name="name" /></td>
                <td onClick={this.changeDirection}>
                    <span className={this.directionCssClass()}></span>
                </td>
                <td><input type="number" className="form-control" value={this.state.item.value} name="value" /></td>
                <td>
                    <select className="form-control" value={this.state.item.walletId} name="walletId">
                        {this.props.wallets.map(wallet =>
                            <option value={wallet.moneyWalletId}>{wallet.name}</option>)}
                    </select>
                </td>
                <td><input type="text" className="form-control" value={this.state.item.category} name="category" /></td>
                <td><input type="comment" className="form-control" value={this.state.item.comment} name="comment" /></td>
                <td>
                    <SaveCancel save={this.saveTransaction} cancel={this.cancelTransaction} />
                </td>
            </tr>
        );
    }

    private renderViewRow() {
        return (
            <tr className={this.state.item.cssClass}>
                <td>{this.state.item.createdAtText}</td>
                <td>{this.state.item.name}</td>
                <td>
                    <span className={this.directionCssClass()}></span>
                </td>
                <td>{this.state.item.value}</td>
                <td>{this.state.item.walletName}</td>
                <td>{this.state.item.category}</td>
                <td>{this.state.item.comment}</td>
                <td>
                    <EditDelete edit={this.editTransaction} delete_={this.deleteTransaction} />
                </td>
            </tr>
        );
    }
}