import * as React from "react";
import * as moment from "moment";
import { Wallet, ArticleModel, CategoryModel } from "walletApi";
import { TransactionViewModel, nextDirection, getWalletNameById } from "common/models";
import { bind, updateState } from "walletCommon";
import { EditDelete, SaveCancel } from "common/misc";
import { DirectionIcon } from "common/misc";
import { ITransactionTableExtFunction } from "../models";
import { WalletSelector, NameInput, CategoryInput } from 'common/specialInputs';

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

    @bind
    nameSelected(model: ArticleModel) {
        this.setState((prevState, props) => {
            return {
                item: { ...prevState.item, name: model.name }
            };
        });
    }
    
    @bind
    categorySelected(model: CategoryModel) {
        this.setState((prevState, props) => {
            return {
                item: { ...prevState.item, category: model.name }
            };
        });
    }

    render() {
        return this.state.editMode ? this.renderEditRow() : this.renderViewRow();
    }

    private renderEditRow() {
        const { item } = this.state;
        const { wallets, rowColor } = this.props;
        return (
            <tr className={rowColor && rowColor(item)} onChange={this.handleInputChange}>
                <td>
                    <input type="date" className="form-control" value={item.createdAt} name="createdAt" />
                </td>
                <td>
                    <NameInput value={item.name} className="form-control" onSelect={this.nameSelected} />
                </td>
                <td onClick={this.changeDirection}>
                    <DirectionIcon direction={item.direction} />
                </td>
                <td>
                    <input type="number" className="form-control" value={item.price} name="price" autoComplete="off" />
                </td>
                <td>
                    <WalletSelector walletId={item.walletId} wallets={wallets} className="form-control" />
                </td>
                <td>
                    <CategoryInput value={item.category} onSelect={this.categorySelected} className="form-control" />
                </td>
                <td>
                    <input type="text" className="form-control" value={item.comment} name="comment" autoComplete="off" />
                </td>
                <td>
                    <SaveCancel save={this.saveTransaction} cancel={this.cancelTransaction} />
                </td>
            </tr>
        );
    }

    private renderViewRow() {
        const { rowColor, wallets } = this.props;
        const { item } = this.state;
        return (
            <tr className={rowColor && rowColor(item)}>
                <td>{item.createdAt}</td>
                <td>{item.name}</td>
                <td>
                    <DirectionIcon direction={item.direction} />
                </td>
                <td>{item.price}</td>
                <td>{getWalletNameById(item.walletId, wallets)}</td>
                <td>{item.category}</td>
                <td>{item.comment}</td>
                <td>
                    <EditDelete edit={this.editTransaction} delete_={this.deleteTransaction} />
                </td>
            </tr>
        );
    }
}
