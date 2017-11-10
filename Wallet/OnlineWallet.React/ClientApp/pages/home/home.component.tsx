import * as React from 'react';
import * as moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { walletService, Wallet, Transaction, MoneyDirection } from "walletApi";
import { Layout } from 'layout';
import { TransactionTable, IInternalTransaction } from 'common/transactions-view';
import { bind } from 'walletCommon';
import { FormGroup } from 'common/misc';
import { dateFormat } from 'common/constants';

export namespace Home {
    export interface Props {

    }

    export interface State {
        wallets: Wallet[];
        items: Transaction[];
        newItem: IInternalTransaction;
    }
}

export class Home extends React.Component<Home.Props, Home.State> {//<Home.Props, Home.State>

    /**
     *
     */
    constructor() {
        super();
        this.state = {
            wallets: [],
            items: [],
            newItem: {
                walletId: 2,
                createdAt: new Date(moment().format(dateFormat)),
                createdAtText: moment().format(dateFormat),
                direction: MoneyDirection.Expense,
                name: "",
                value: 0,
                cssClass: undefined,
                walletName: undefined
            }
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
    deleteRow(item: Transaction) {

    }

    @bind
    updateRow(item: Transaction[]) {

    }

    render() {
        return (
            <Layout>
                <form>
                    <FormGroup name="createdAt" label="Date" type="date" value={this.state.newItem.createdAtText} />
                    <FormGroup name="name" label="Name" value={this.state.newItem.name} />
                    <FormGroup name="value" label="Price" type="number" value={this.state.newItem.value} />
                    <FormGroup name="comment" label="Comment" value={this.state.newItem.comment} />
                    <FormGroup name="category" label="Category" value={this.state.newItem.category} />
                    <div className="form-group row">
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="direction" value="-1" /> Expense</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="direction" value="0" /> Plan</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="direction" value="1" /> Salary</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Add</button>
                    <button type="button" className="btn btn-success" >Save</button>
                </form>
                <TransactionTable items={this.state.items} deleted={this.deleteRow} update={this.updateRow} />
            </Layout>
        );
    }
}