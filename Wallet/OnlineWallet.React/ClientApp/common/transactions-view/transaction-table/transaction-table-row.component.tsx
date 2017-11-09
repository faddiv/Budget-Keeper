import * as React from "react";
import * as moment from "moment";
import { Transaction, Wallet, MoneyDirection } from "walletApi";
import { ITransactionTableExtFunction } from "common/transactions-view/models";
import { ListHelpers, bind, updateState, toUTCDate } from "walletCommon";
import { EditDelete, SaveCancel } from "common/misc";
import { dateFormat } from "../../constants";

interface IInternalTransaction extends Transaction {
    createdAtText: string;
    cssClass: string;
    walletName: string;
}

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
        item: IInternalTransaction;
        original: Transaction;
    }
}

export class TransactionTableRow extends React.Component<TransactionTableRow.Props, TransactionTableRow.State> {

    constructor(props: TransactionTableRow.Props) {
        super(props);
        this.state = {
            editMode: false,
            item: toInternalTransaction(props.item, props),
            original: props.item
        };
    }

    componentWillReceiveProps(nextProps: Readonly<TransactionTableRow.Props>) {
        if (this.state.original !== nextProps.item) {
            this.setState({
                item: toInternalTransaction(nextProps.item, nextProps),
                original: nextProps.item
            });
        }
    }

    @bind
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

    private getWalletName(item: Transaction) {
        return ListHelpers.selectMap<Wallet, string>(this.props.wallets, w => w.moneyWalletId === item.walletId, w => w.name);
    }

    @bind
    private changeDirection() {
        this.setItemState((prevState, props) => {
            return {
                direction: nextDirection(prevState.direction)
            }
        });
    }

    private setItemState(callback: Transaction | ((prevState: Transaction, props: TransactionTableRow.Props) => Partial<Transaction>)) {
        this.setState((prevState, props) => {
            const nextState = typeof (callback) === "function"
                ? callback(prevState.item, props)
                : callback;
            const model = Object.assign({}, prevState.item, nextState);
            updateInternalTransaction(model, props);
            return {
                item: model
            };
        });
    }

    @bind
    private saveTransaction() {
        this.props.saveTransaction(this.state.item, this.props.item);
        this.setState({
            editMode: false
        });
    }

    @bind
    private deleteTransaction() {
        this.props.deleteTransaction(this.props.item);
    }

    @bind
    private editTransaction() {
        this.setState((prevState, props) => ({
            editMode: true
        }));
    }

    @bind
    private cancelTransaction() {
        this.setState((prevState, props) => ({
            editMode: false,
            item: toInternalTransaction(props.item, props)
        }));
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLTableRowElement>) {
        var state = updateState(event);
        if(state.walletId) {
            state.walletId = parseInt(state.walletId, 10);
        }
        if(state.createdAtText) {
            state.createdAt = toUTCDate(state.createdAtText);
        }
        this.setState((prevState, props) => {
            let newItem = toInternalTransaction(prevState.item, props);
            Object.assign(newItem, state);
            return {
                item: newItem
            };
        });
    }

    render() {
        return this.state.editMode ? this.renderEditRow() : this.renderViewRow();
    }

    private renderEditRow() {
        return (
            <tr className={this.state.item.cssClass} onChangeCapture={this.handleInputChange}>
                <td><input type="date" className="form-control" value={this.state.item.createdAtText} name="createdAtText" /></td>
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

function nextDirection(direction: MoneyDirection) {
    switch (direction) {
        case MoneyDirection.Expense:
            return MoneyDirection.Income;
        case MoneyDirection.Income:
            return MoneyDirection.Plan;
        case MoneyDirection.Plan:
            return MoneyDirection.Expense;
    }
}

function toInternalTransaction(item: Transaction, props: TransactionTableRow.Props): IInternalTransaction {
    return {
        ...item,
        createdAtText: moment(item.createdAt).format(dateFormat),
        cssClass: props.rowModifier(item),
        walletName: ListHelpers.selectMap<Wallet, string>(props.wallets, w => w.moneyWalletId === item.walletId, w => w.name)
    };
}

function updateInternalTransaction(item: IInternalTransaction, props: TransactionTableRow.Props): IInternalTransaction {
    item.createdAtText = moment(item.createdAt).format(dateFormat);
    item.cssClass = props.rowModifier(item);
    item.walletName = ListHelpers.selectMap<Wallet, string>(props.wallets, w => w.moneyWalletId === item.walletId, w => w.name);
    return item;
}

