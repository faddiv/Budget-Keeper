import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { bind } from "bind-decorator";

import { Wallet } from "walletApi";
import { TransactionTableRow } from "./transaction-table-row";
import { TransactionViewModel, ITransactionTableExtFunction } from "walletCommon";
import { _ } from "helpers";
import { TransactionSummaryActions } from "actions/transactionsSummary";
import { RootState } from "reducers";
import { AlertsActions } from "actions/alerts";

enum SelectMode {
    deselect,
    none,
    select
}

export interface TransactionTableProps {
    actions?: typeof TransactionSummaryActions;
    alerts?: typeof AlertsActions;
    items: TransactionViewModel[];
    wallets: Wallet[];
    changedItems?: TransactionViewModel[];
    rowColor?: ITransactionTableExtFunction;
    transactionSummary?: TransactionViewModel[];
    update?(items: TransactionViewModel[], changedItems?: TransactionViewModel[]): void;
    deleted?(items: TransactionViewModel): void;
}

export interface TransactionTableState {
    selectMode: SelectMode;
}

@connect(mapStateToProps, mapDispatchToProps)
export class TransactionTable extends React.Component<TransactionTableProps, TransactionTableState> {

    constructor(props: TransactionTableProps) {
        super(props);
        this.state = {
            selectMode: SelectMode.none
        };
    }

    private getFromSummaryById(item: TransactionViewModel): TransactionViewModel {
        return this.props.transactionSummary.find(ts => {
            if (ts === item) {
                return true;
            }
            if (ts.transactionId && item.transactionId) {
                return ts.transactionId === item.transactionId;
            }
            return ts.key === item.key;
        });
    }

    componentWillReceiveProps(nextProps: Readonly<TransactionTableProps>) {
        if (this.props.items !== nextProps.items) {
            const newSelection = [];
            for (const newTransaction of nextProps.items) {
                const originalTransaction = this.getFromSummaryById(newTransaction);
                if (!originalTransaction) {
                    continue;
                }
                newSelection.push(newTransaction);
            }
            this.props.actions.transactionsSelected(newSelection);
        }
    }

    @bind
    saveTransaction(newItem: TransactionViewModel, original: TransactionViewModel) {
        const items = _.replace(this.props.items, newItem, original);
        const changes = this.props.changedItems ? _.replace(this.props.changedItems, newItem, original, true) : undefined;
        this.props.update(items, changes);
    }

    @bind
    deleteTransaction(item: TransactionViewModel) {
        this.props.deleted(item);
    }

    @bind
    startSelection(item: TransactionViewModel) {
        this.setState((_prevState: TransactionTableState, props: TransactionTableProps) => {
            const selectMode = _.contains(props.transactionSummary, item)
                ? SelectMode.deselect
                : SelectMode.select;
            const selected = selectMode === SelectMode.select
                ? [...props.transactionSummary, item]
                : _.remove(props.transactionSummary, item);
            props.actions.transactionsSelected(selected);
            return {
                selectMode,
                selected
            };
        });
    }

    @bind
    selectingRow(item: TransactionViewModel) {
        if (this.state.selectMode === SelectMode.none) { return; }
        let selected: TransactionViewModel[];
        if (this.state.selectMode === SelectMode.select) {
            if (!_.contains(this.props.transactionSummary, item)) {
                selected = [...this.props.transactionSummary, item];
            }
        } else {
            if (_.contains(this.props.transactionSummary, item)) {
                selected = _.remove(this.props.transactionSummary, item);
            }
        }
        if (selected) {
            this.props.actions.transactionsSelected(selected);
        }
    }

    @bind
    endSelection() {
        this.setState({
            selectMode: SelectMode.none
        });
    }

    @bind
    errorHandler(e: Error) {
        this.props.alerts.showAlert({ type: "danger", message: e.message });
    }

    render() {
        const { items, wallets, rowColor, transactionSummary, update } = this.props;
        const editable = !!update;
        return (
            <table className="table transactions" onMouseLeave={this.endSelection}>
                <thead>
                    <tr>
                        <th className="created-at">createdAt</th>
                        <th className="name">name</th>
                        <th className="direction">dir</th>
                        <th className="price">price</th>
                        <th className="wallet-name">walletName</th>
                        <th className="category">category</th>
                        <th>comment</th>
                        {editable && <th className="commands"></th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map(item =>
                        <TransactionTableRow
                            key={item.key}
                            item={item}
                            selected={_.contains(transactionSummary, item)}
                            wallets={wallets}
                            deleteTransaction={this.deleteTransaction}
                            saveTransaction={this.saveTransaction}
                            editable={editable}
                            rowColor={rowColor}
                            rowMouseDown={this.startSelection}
                            rowMouseEnter={this.selectingRow}
                            rowMouseUp={this.endSelection}
                            onError={this.errorHandler} />)}
                </tbody>
            </table>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        transactionSummary: state.transactionSummary
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionSummaryActions as any, dispatch) as typeof TransactionSummaryActions,
        alerts: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}
