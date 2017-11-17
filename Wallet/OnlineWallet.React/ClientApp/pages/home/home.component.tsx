import * as React from 'react';
import * as moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AlertsActions from "actions/alerts"
import { walletService, Wallet, Transaction, MoneyDirection, transactionService, ArticleModel } from "walletApi";
import { Layout } from 'layout';
import { TransactionTable, getDirectionColoring } from 'common/transactions-view';
import { bind, updateState, ListHelpers } from 'walletCommon';
import { FormGroup, WalletSelector, NameInput } from 'common/misc';
import { toDateString, TransactionViewModel, mapTransaction, getWalletNameById } from 'common/models';
import { DirectionCheck } from 'pages/home/directionCheck';
import { RootState } from 'reducers';

export namespace Home {
    export interface Props {
        wallets: Wallet[];
        actions?: typeof AlertsActions,
    }

    export interface State {
        items: TransactionViewModel[];
        newItem: TransactionViewModel;
        id: number;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class Home extends React.Component<Home.Props, Home.State> {
    nameInput: NameInput;

    /**
     *
     */
    constructor() {
        super();
        this.state = {
            items: [],
            newItem: this.emptyItem(1),
            id: 1
        };
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.confirmLeave);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.confirmLeave);
    }

    get alertsService() {
        return this.props.actions;
    }

    @bind
    confirmLeave(event: BeforeUnloadEvent) {
        if (this.needLeaveConfirmation()) {
            event.returnValue = leaveConfirmation;
            return leaveConfirmation;
        }
    }

    @bind
    deleteRow(item: TransactionViewModel) {
        this.setState((prevState, props) => {
            return {
                items: ListHelpers.remove(prevState.items, item),
            };
        });
    }

    @bind
    updateRow(items: TransactionViewModel[]) {
        this.setState((prevState, props) => {
            return {
                items: items,
            };
        });
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
        var state = updateState(event);
        if (state.walletId) {
            state.walletId = parseInt(state.walletId, 10);
        }
        if (state.direction) {
            state.direction = parseInt(state.direction, 10);
        }
        this.setState((prevState, props) => {
            var newItem = { ...prevState.newItem, ...state };
            newItem.cssClass = getDirectionColoring(newItem);
            return {
                newItem
            };
        });
    }

    @bind
    nameSelected(item: ArticleModel) {
        this.setState((prevState, props) => {
            return {
                newItem: {
                    ...prevState.newItem,
                    name: item.name,
                    category: item.category,
                    price: item.lastPrice,
                }
            };
        });
    }

    @bind
    addLine(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState((prevState, props) => {
            var item: TransactionViewModel = {
                ...prevState.newItem,
                walletName: getWalletNameById(prevState.newItem.walletId, props.wallets)
            };
            return {
                items: [...prevState.items, prevState.newItem],
                newItem: {
                    ...prevState.newItem,
                    name: "",
                    category: "",
                    comment: "",
                    price: "",
                    key: prevState.id + 1
                },
                id: prevState.id + 1
            };
        }, () => {
            const nameInput = this.nameInput;
            nameInput.focus();
        });
    }

    @bind
    async saveAll() {
        try {
            this.alertsService.dismissAllAlert();
            if (!this.state.items.length) {
                this.alertsService.showAlert({ type: "warning", message: "Nothing to save" });
                return;
            }
            var serverItems = mapTransaction(this.state.items);
            var result = await transactionService.batchUpdate(serverItems);
            this.alertsService.showAlert({ type: "success", message: "Transactions are saved successfully."});
            this.setState({
                items: [],
                newItem: this.emptyItem(1),
                id: 1
            });
        } catch (e) {
            this.alertsService.showAlert({ type: "danger", message: e.message});
        }
    }

    needLeaveConfirmation() {
        return this.state.items.length > 0;
    }
    /* Something is wrong:
    <FormGroup name="createdAt" label="Date">
        <input type="text" className="form-control" id="createdAt" name="createdAt" value={this.state.newItem.createdAt} />
    </FormGroup>
    */
    render() {
        return (
            <Layout leaveConfirmation={{ when: this.needLeaveConfirmation(), message: leaveConfirmation }}>
                <form onChange={this.handleInputChange} onSubmit={this.addLine}>
                    <FormGroup name="walletId" label="Wallet">
                        <WalletSelector walletId={this.state.newItem.walletId} wallets={this.props.wallets} />
                    </FormGroup>
                    <FormGroup name="createdAt" label="Date" type="date" value={this.state.newItem.createdAt} />
                    <FormGroup name="name" label="Name">
                        <NameInput ref={(input) => this.nameInput = input} value={this.state.newItem.name} autoFocus={true} onSelect={this.nameSelected} />
                    </FormGroup>
                    <FormGroup name="price" label="Price" type="number" value={this.state.newItem.price} />
                    <FormGroup name="comment" label="Comment" value={this.state.newItem.comment} />
                    <FormGroup name="category" label="Category" value={this.state.newItem.category} />
                    <DirectionCheck value={this.state.newItem.direction} />
                    <button type="submit" className="btn btn-primary">Add</button>
                    <button type="button" className="btn btn-success" onClick={this.saveAll}>Save</button>
                </form>
                <TransactionTable items={this.state.items} deleted={this.deleteRow} update={this.updateRow} rowColor={getDirectionColoring} />
            </Layout>
        );
    }

    private emptyItem(id: number): TransactionViewModel {
        return {
            walletId: 2,
            createdAt: toDateString(new Date()),
            direction: MoneyDirection.Expense,
            name: "",
            price: "",
            walletName: "",
            comment: "",
            category: "",
            key: id
        };
    }
}

function mapStateToProps(state: RootState, ownProps: any) {
    return {
        wallets: state.wallets
    };
}

function mapDispatchToProps(dispatch, ownProps: any) {
    return {
        actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}

const leaveConfirmation = "There are added items. Are you sure leaving?";