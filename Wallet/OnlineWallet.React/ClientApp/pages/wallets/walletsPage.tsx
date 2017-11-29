import { Wallet, walletService } from 'walletApi';
import * as React from 'react';
import { WalletsRow } from './walletsRow';
import { ListHelpers, bind, className } from 'walletCommon';
import { Layout } from 'layout';
import { validate, initValidationState, ValidationConfig, ValidationState } from 'walletCommon/validation';
import * as validators from 'walletCommon/validation/commonValidators';

export namespace Wallets {
    export interface Props {
    }
    export interface State {
        wallets: Wallet[];
        name: string;
        rules: ValidationConfig<State, Props>;
        validation: ValidationState;
    }
}

export class Wallets extends React.Component<Wallets.Props, Wallets.State> {

    constructor(props) {
        super(props);
        this.state = {
            wallets: [],
            name: "",
            rules: {
                name: {
                    valueGetter: (state) => state.name,
                    validator: validators.required,
                    message: "Name field required",
                }
            },
            validation: {}
        };
        initValidationState(this.state.rules, this.state.validation, this.state, this.props);
    }

    async componentDidMount() {
        try {
            const wallets = await walletService.getAll();
            var validation = await validate(this.state.rules, this.state.validation, this.state, this.props);
            this.setState({
                wallets,
                validation
            });
        } catch (error) {
            alert(error);
        }
    }

    @bind
    async deleteWallet(wallet: Wallet) {
        if (!confirm("Are you sure deleting this item?")) {
            return;
        }
        try {
            await walletService.delete(wallet);
            this.setState((prevState, props) => {
                return {
                    wallets: ListHelpers.remove(prevState.wallets, wallet)
                }
            });
        } catch (e) {
            alert(e);
        }
    }

    @bind
    async saveWallet(newWallet: Wallet, original: Wallet) {
        try {
            const result = await walletService.update(newWallet);
            this.setState((prevState, props) => {
                return {
                    wallets: ListHelpers.replace(prevState.wallets, result, original)
                }
            });
        } catch (result) {
            alert(result);
            this.setState((prevState, props) => {
                return {
                    wallets: [...prevState.wallets]
                }
            });
        }
    }

    @bind
    async insertWallet(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!this.state.name) return;
        var wallet = await walletService.insert({
            name: this.state.name
        });
        this.setState((prevState, props) => {
            return {
                wallets: [...prevState.wallets, wallet],
                name: ""
            };
        });
    }

    @bind
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var state = Object.assign({}, this.state, {
            [name]: value
        });
        this.setState(state, async () => {
            var validation = await validate(this.state.rules, this.state.validation, this.state, this.props);
            if (validation !== this.state.validation) {
                this.setState({
                    validation
                });
            }
        });
    }

    render() {
        const { } = this.props;
        const { validation } = this.state;
        return (
            <Layout>
                <form onSubmit={this.insertWallet}>
                    <div className="form-group row">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-10">
                            <input type="text" className={className("form-control", validation.name.showError, "is-invalid")} 
                                id="name" name="name" value={this.state.name} onChange={this.handleInputChange} />
                            <div className="invalid-feedback">
                                {validation.name.message}
                            </div>
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
            </Layout>
        );
    }
}