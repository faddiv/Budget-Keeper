import { Wallet, walletService } from 'walletApi';
import * as React from 'react';
import { WalletsRow } from './walletsRow.component';
import { ListHelpers } from 'walletCommon';

export namespace Wallets {
    export interface Props {
    }
    export interface State {
        wallets: Wallet[];
    }
}

export class Wallets extends React.Component<Wallets.Props, Wallets.State> {

    constructor(props) {
        super(props);
        this.state = {
            wallets: []
        };
        this.deleteWallet = this.deleteWallet.bind(this);
        this.saveWallet = this.saveWallet.bind(this);
    }

    componentDidMount() {
        walletService.getAll()
            .then(wallets => {
                this.setState({
                    wallets: wallets
                });
            });
    }

    deleteWallet(wallet: Wallet) {
        if (confirm("Are you sure deleting this item?")) {
            this.setState((prevState, props) => {
                return {
                    wallets: ListHelpers.remove(prevState.wallets, wallet)
                }
            });
        }
    }

    saveWallet(newWallet: Wallet, original: Wallet) {
        walletService.update(newWallet)
            .then(result => {
                this.setState((prevState, props) => {
                    return {
                        wallets: ListHelpers.replace(prevState.wallets, result, original)
                    }
                });
            }).catch(result => {
                alert("save failed");
                this.setState((prevState, props) => {
                    return {
                        wallets: ListHelpers.replace(prevState.wallets, Object.assign({}, original), original)
                    }
                });
            });

    }

    render() {
        return (
            <div>
                <form>
                    <div className="form-group row">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="name" />
                        </div>
                    </div>
                </form>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.wallets.map(wallet => (
                            <WalletsRow key={wallet.moneyWalletId} wallet={wallet} save={this.saveWallet} delete_={this.deleteWallet} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}