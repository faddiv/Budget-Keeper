import * as React from "react";
import * as classNames from "classnames";
import { bind } from "bind-decorator";

import { Wallet, ArticleModel, CategoryModel } from "walletApi";
import { DirectionIcon, SaveCancel, EditDelete, ITransactionTableExtFunction, WalletSelector, NameInput, CategoryInput, TransactionViewModel, nextDirection, getWalletNameById } from "walletCommon";
import { noop } from "helpers";
import { updateState, isClickableClicked } from "react-ext";

export interface TransactionTableRowProps {
    item: TransactionViewModel;
    selected: boolean;
    wallets: Wallet[];
    rowColor?: ITransactionTableExtFunction;
    editable: boolean;
    saveTransaction(newItem: TransactionViewModel, originalItem: TransactionViewModel): void;
    deleteTransaction(item: TransactionViewModel): void;
    rowMouseDown(item: TransactionViewModel): void;
    rowMouseUp(): void;
    rowMouseEnter(item: TransactionViewModel): void;
}

export interface TransactionTableRowState {
    editMode: boolean;
    item: TransactionViewModel;
    original: TransactionViewModel;
}

export class TransactionTableRow extends React.Component<TransactionTableRowProps, TransactionTableRowState> {

    constructor(props: TransactionTableRowProps) {
        super(props);
        this.state = {
            editMode: false,
            item: props.item,
            original: props.item
        };
    }

    componentWillReceiveProps(nextProps: Readonly<TransactionTableRowProps>) {
        if (this.state.original !== nextProps.item) {
            this.setState({
                item: nextProps.item,
                original: nextProps.item
            });
        }
    }

    @bind
    changeDirection(event: React.MouseEvent<HTMLTableDataCellElement>) {
        event.preventDefault();
        this.setState((prevState) => {
            return {
                item: { ...prevState.item, direction: nextDirection(prevState.item.direction) }
            };
        });
    }

    @bind
    saveTransaction() {
        this.props.saveTransaction(this.state.item, this.props.item);
        this.setState({
            editMode: false
        });
    }

    @bind
    deleteTransaction() {
        this.props.deleteTransaction(this.props.item);
    }

    @bind
    editTransaction() {
        this.setState({
            editMode: true
        });
    }

    @bind
    cancelTransaction() {
        this.setState((_prevState, props) => ({
            editMode: false,
            item: props.item
        }));
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLElement>) {
        const state = updateState(event);
        if (state.walletId) {
            state.walletId = parseInt(state.walletId, 10);
        }
        this.setState((prevState) => {
            return {
                item: { ...prevState.item, ...state }
            };
        });
    }

    @bind
    nameSelected(model: ArticleModel) {
        this.setState((prevState) => {
            return {
                item: {
                    ...prevState.item,
                    name: model.name
                }
            };
        });
    }

    @bind
    categorySelected(model: CategoryModel) {
        this.setState((prevState) => {
            return {
                item: {
                    ...prevState.item,
                    category: model.name
                }
            };
        });
    }

    @bind
    startSelection(event: React.MouseEvent<HTMLTableRowElement>) {
        if (event.isDefaultPrevented() ||
            isClickableClicked(event)) {
            return;
        }
        this.props.rowMouseDown(this.props.item);
        event.preventDefault();
    }

    @bind
    continueSelection(event: React.MouseEvent<HTMLTableRowElement>) {
        if (event.isDefaultPrevented() ||
            isClickableClicked(event)) {
            return;
        }
        this.props.rowMouseEnter(this.props.item);
    }

    @bind
    endSelection(event: React.MouseEvent<HTMLTableRowElement>) {
        if (event.isDefaultPrevented() ||
            isClickableClicked(event)) {
            return;
        }
        this.props.rowMouseUp();
    }

    render() {
        return this.state.editMode ? this.renderEditRow() : this.renderViewRow();
    }

    renderEditRow() {
        const { item } = this.state;
        const { wallets, rowColor, selected } = this.props;
        const hasRowColor = !!rowColor;
        return (
            <tr className={classNames({ [rowColor(item)]: hasRowColor }, { selected })} onChange={this.handleInputChange}
                onMouseDown={this.startSelection} onMouseEnter={this.continueSelection} onMouseUp={this.endSelection}>
                <td>
                    <input type="date" className="form-control" value={item.createdAt} name="createdAt" onChange={noop} />
                </td>
                <td>
                    <NameInput value={item.name} className="form-control" onSelect={this.nameSelected} />
                </td>
                <td onClick={this.changeDirection}>
                    <DirectionIcon direction={item.direction} />
                </td>
                <td>
                    <input type="number" className="form-control" value={item.price} name="price" autoComplete="off" onChange={noop} />
                </td>
                <td>
                    <WalletSelector walletId={item.walletId} wallets={wallets} className="form-control" />
                </td>
                <td>
                    <CategoryInput value={item.category} onSelect={this.categorySelected} className="form-control" />
                </td>
                <td>
                    <input type="text" className="form-control" value={item.comment} name="comment" autoComplete="off" onChange={noop} />
                </td>
                <td>
                    <SaveCancel save={this.saveTransaction} cancel={this.cancelTransaction} />
                </td>
            </tr>
        );
    }

    renderViewRow() {
        const { rowColor, wallets, selected, editable } = this.props;
        const { item } = this.state;
        const hasRowColor = !!rowColor;
        return (
            <tr className={classNames({ [rowColor(item)]: hasRowColor }, { selected })}
                onMouseDown={this.startSelection} onMouseEnter={this.continueSelection} onMouseUp={this.endSelection}>
                <td>{item.createdAt}</td>
                <td>{item.name}</td>
                <td>
                    <DirectionIcon direction={item.direction} />
                </td>
                <td>{item.price}</td>
                <td>{getWalletNameById(item.walletId, wallets)}</td>
                <td>{item.category}</td>
                <td>{item.comment}</td>
                {editable &&
                    <td>
                        <EditDelete edit={this.editTransaction} delete_={this.deleteTransaction} />
                    </td>}
            </tr>
        );
    }
}
