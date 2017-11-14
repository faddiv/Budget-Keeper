import * as React from "react";
import * as moment from "moment";
import { Wallet } from "walletApi";
import { TransactionViewModel, nextDirection } from "common/models";
import { bind, updateState } from "walletCommon";
import { EditDelete, SaveCancel, WalletSelector } from "common/misc";
import { DirectionIcon } from "common/misc";
import { ITransactionTableExtFunction } from "../models";

export namespace TransactionTableRow {
    export interface Props {
        item: TransactionViewModel;
        wallets: Wallet[];
        saveTransaction(newItem: TransactionViewModel, originalItem: TransactionViewModel): void;
        deleteTransaction(item: TransactionViewModel): void;
        rowColor?: ITransactionTableExtFunction
    }

    export interface State {
        editMode: boolean;
        item: TransactionViewModel;
        original: TransactionViewModel;
    }
}

export class TransactionTableRow extends React.Component<TransactionTableRow.Props, TransactionTableRow.State> {

    constructor(props: TransactionTableRow.Props) {
        super(props);
        this.state = {
            editMode: false,
            item: props.item,
            original: props.item
        };
    }

    componentWillReceiveProps(nextProps: Readonly<TransactionTableRow.Props>) {
        if (this.state.original !== nextProps.item) {
            this.setState({
                item: nextProps.item,
                original: nextProps.item
            });
        }
    }

    @bind
    private changeDirection() {
        this.setState((prevState, props) => {
            return {
                item: { ...prevState.item, direction: nextDirection(prevState.item.direction) }
            }
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
            item: props.item
        }));
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLElement>) {
        var state = updateState(event);
        if (state.walletId) {
            state.walletId = parseInt(state.walletId, 10);
        }
        this.setState((prevState, props) => {
            return {
                item: { ...prevState.item, ...state }
            };
        });
    }

    render() {
        return this.state.editMode ? this.renderEditRow() : this.renderViewRow();
    }

    private renderEditRow() {
        return (
            <tr className={this.props.rowColor && this.props.rowColor(this.state.item)} onChange={this.handleInputChange}>
                <td>
                    <input type="date" className="form-control" value={this.state.item.createdAt} name="createdAt" />
                </td>
                <td>
                    <input type="text" className="form-control" value={this.state.item.name} name="name" />
                </td>
                <td onClick={this.changeDirection}>
                    <DirectionIcon direction={this.state.item.direction} />
                </td>
                <td>
                    <input type="number" className="form-control" value={this.state.item.price} name="price" />
                </td>
                <td>
                    <WalletSelector walletId={this.state.item.walletId} wallets={this.props.wallets} />
                </td>
                <td>
                    <input type="text" className="form-control" value={this.state.item.category} name="category" />
                </td>
                <td>
                    <input type="text" className="form-control" value={this.state.item.comment} name="comment" />
                </td>
                <td>
                    <SaveCancel save={this.saveTransaction} cancel={this.cancelTransaction} />
                </td>
            </tr>
        );
    }

    private renderViewRow() {
        return (
            <tr className={this.props.rowColor && this.props.rowColor(this.state.item)}>
                <td>{this.state.item.createdAt}</td>
                <td>{this.state.item.name}</td>
                <td>
                    <DirectionIcon direction={this.state.item.direction} />
                </td>
                <td>{this.state.item.price}</td>
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
