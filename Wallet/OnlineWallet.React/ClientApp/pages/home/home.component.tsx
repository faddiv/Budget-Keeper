import * as React from 'react';
import * as moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { walletService, Wallet, Transaction, MoneyDirection, transactionService } from "walletApi";
import { Layout } from 'layout';
import { TransactionTable, getDirectionColoring } from 'common/transactions-view';
import { bind, updateState, ListHelpers } from 'walletCommon';
import { FormGroup, WalletSelector } from 'common/misc';
import { toDateString, TransactionViewModel, mapTransaction, getWalletNameById } from 'common/models';
import { DirectionCheck } from 'pages/home/directionCheck';

export namespace Home {
    export interface Props {

    }

    export interface State {
        wallets: Wallet[];
        items: TransactionViewModel[];
        newItem: TransactionViewModel;
        id: number;
    }
}

export class Home extends React.Component<Home.Props, Home.State> {

    /**
     *
     */
    constructor() {
        super();
        this.state = {
            wallets: [],
            items: [],
            newItem: this.emptyItem(1),
            id: 1
        };
    }

    componentDidMount() {
        walletService.getAll()
            .then(wallets => {
                this.setState({
                    wallets: wallets
                })
            })
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
    addLine(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState((prevState, props) => {
            var item: TransactionViewModel = {
                ...prevState.newItem,
                walletName: getWalletNameById(prevState.newItem.walletId, prevState.wallets)
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
        });
    }

    @bind
    async saveAll() {
        try {
            //this.alertsService.dismissAll();
            if (!this.state.items.length) {
                //this.alertsService.warning("Nothing to save");
                return;
            }
            var serverItems = mapTransaction(this.state.items);
            var result = await transactionService.batchUpdate(serverItems);
            //this.alertsService.success("Transactions are saved successfully.");
            this.setState({
                items: [],
                newItem: this.emptyItem(1),
                id: 1
            });
        } catch (e) {
            //this.alertsService.error(error.message);
        }
    }
    /* Something is wrong:
    <FormGroup name="createdAt" label="Date">
        <input type="text" className="form-control" id="createdAt" name="createdAt" value={this.state.newItem.createdAt} />
    </FormGroup>
    */
    render() {
        return (
            <Layout>
                <form onChange={this.handleInputChange} onSubmit={this.addLine}>
                    <FormGroup name="walletId" label="Wallet">
                        <WalletSelector walletId={this.state.newItem.walletId} wallets={this.state.wallets} />
                    </FormGroup>
                    <FormGroup name="createdAt" label="Date" type="date" value={this.state.newItem.createdAt} />
                    <FormGroup name="name" label="Name">
                        <input type="text" className="form-control" id="name" name="name" value={this.state.newItem.name} />
                    </FormGroup>
                    <FormGroup name="price" label="Price">
                        <input type="text" className="form-control" id="price" name="price" value={this.state.newItem.price} />
                    </FormGroup>
                    <FormGroup name="comment" label="Comment">
                        <input type="text" className="form-control" id="comment" name="comment" value={this.state.newItem.comment} />
                    </FormGroup>
                    <FormGroup name="category" label="Category">
                        <input type="text" className="form-control" id="category" name="category" value={this.state.newItem.category} />
                    </FormGroup>
                    <DirectionCheck value={this.state.newItem.direction} />
                    <button type="submit" className="btn btn-primary">Add</button>
                    <button type="button" className="btn btn-success" onClick={this.saveAll}>Save</button>
                </form>
                <TransactionTable items={this.state.items} deleted={this.deleteRow} update={this.updateRow} />
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
            cssClass: "",
            walletName: "",
            comment: "",
            category: "",
            key: id
        };
    }
}