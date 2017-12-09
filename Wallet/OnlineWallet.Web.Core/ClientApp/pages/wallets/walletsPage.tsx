import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as WalletsActions from "actions/wallets";
import { Wallet, walletService } from 'walletApi';
import { WalletsRow } from './walletsRow';
import { className } from 'react-ext';
import { Layout } from 'layout';
import { bind, validate, ValidationConfig, ValidationState } from 'helpers';
import * as validators from 'helpers/validation/commonValidators';
import { RootState } from 'reducers';

export namespace Wallets {
    export interface Props {
        wallets: Wallet[];
        actions: typeof WalletsActions;
    }
    export interface State {
        name: string;
        rules: ValidationConfig<State, Props>;
        validation: ValidationState;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class Wallets extends React.Component<Wallets.Props, Wallets.State> {

    constructor(props: Wallets.Props) {
        super(props);
        const rules: ValidationConfig<Wallets.State, Wallets.Props> = {
            name: {
                validators: [
                    {
                        validator: validators.required,
                        message: "Name is reuired."
                    }
                ],
            }
        };

        this.state = {
            name: "",
            rules: rules,
            validation: validate(rules, {}, undefined, props).validationState,
        };
    }

    @bind
    async deleteWallet(wallet: Wallet) {
        if (!confirm("Are you sure deleting this item?")) {
            return;
        }
        await this.props.actions.deleteWallet(wallet);
    }

    @bind
    async saveWallet(newWallet: Wallet, original: Wallet) {
        await this.props.actions.updateWallet(newWallet);
    }

    @bind
    async insertWallet(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const validationState = validate(this.state.rules, this.state.validation, this.state, this.props, true);
        if (!validationState.isValid) {
            this.setState({
                validation: validationState.validationState
            });
            return;
        }
        await this.props.actions.insertWallet({
            name: this.state.name
        });
        this.setState((prevState, props) => {
            return {
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
        this.setState(state, () => {
            var valResult = validate(this.state.rules, this.state.validation, this.state, this.props);
            if (valResult.changed) {
                this.setState({
                    validation: valResult.validationState
                });
            }
        });
    }

    render() {
        const { wallets } = this.props;
        const { validation, name } = this.state;
        return (
            <Layout>
                <form onSubmit={this.insertWallet}>
                    <div className="form-group row">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-10">
                            <input type="text" className={className("form-control", validation.name.showError, "is-invalid")}
                                id="name" name="name" value={name} onChange={this.handleInputChange} />
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
                        {wallets.map(wallet => (
                            <WalletsRow key={wallet.moneyWalletId} wallet={wallet} save={this.saveWallet} delete_={this.deleteWallet} />
                        ))}
                    </tbody>
                </table>
            </Layout>
        );
    }
}


function mapStateToProps(state: RootState, ownProps: any) {
    return {
        wallets: state.wallets
    };
}

function mapDispatchToProps(dispatch, ownProps: any) {
    return {
        actions: bindActionCreators(WalletsActions as any, dispatch) as typeof WalletsActions
    };
}
