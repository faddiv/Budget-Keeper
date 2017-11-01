import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { walletService, Wallet } from "walletApi";

export namespace Home {
    export interface Props {

    }

    export interface State {
        wallets: Wallet[]
    }
}

export class Home extends React.Component<Home.Props, Home.State> {//<Home.Props, Home.State>

    /**
     *
     */
    constructor() {
        super();
        this.state = {
            wallets: []
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

    renderRow(wallet: Wallet) {
        return (
            <tr key={wallet.moneyWalletId}>
                <td>{wallet.moneyWalletId}</td>
                <td>{wallet.name}</td>
            </tr>
        );
    }

    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>
                            Id
                        </th>
                        <th>
                            Name
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.wallets.map((wallet) => this.renderRow(wallet))}
                </tbody>
            </table>
        );
    }
}