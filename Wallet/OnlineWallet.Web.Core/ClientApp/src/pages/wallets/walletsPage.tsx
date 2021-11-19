import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import classNames from "classnames";
import { bind } from "bind-decorator";

import * as WalletsActions from "../../actions/wallets";
import { Wallet } from "../../walletApi";
import { WalletsRow } from "./walletsRow";
import { Layout } from "../../layout";
import { validate, ValidationConfig, ValidationState, validators } from "../../helpers";
import { RootState } from "../../reducers";

export interface WalletsProps {
    wallets: Wallet[];
    actions: typeof WalletsActions;
}

export interface WalletsState {
    name: string;
    rules: ValidationConfig<WalletsState, WalletsProps>;
    validation: ValidationState;
}

class Wallets2 extends React.Component<WalletsProps, WalletsState> {

    constructor(props: WalletsProps) {
        super(props);
        const rules: ValidationConfig<WalletsState, WalletsProps> = {
            name: {
                validators: [
                    {
                        validator: validators.required,
                        message: "Name is reuired."
                    }
                ]
            }
        };

        this.state = {
            name: "",
            rules,
            validation: validate(rules, {}, undefined as any, props).validationState
        };
    }

    @bind
    async deleteWallet(wallet: Wallet) {
        if (!window.confirm("Are you sure deleting this item?")) {
            return;
        }
        await this.props.actions.deleteWallet(wallet);
    }

    @bind
    async saveWallet(newWallet: Wallet) {
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
        this.setState({
            name: ""
        });
    }

    @bind
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        const state = {
            ...this.state,
            [name]: value
        };
        this.setState(state, () => {
            const valResult = validate(this.state.rules, this.state.validation, this.state, this.props);
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
                            <input type="text" className={classNames("form-control", { "is-invalid": validation.name.showError })}
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
                            <th></th>
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

function mapStateToProps(state: RootState) {
    return {
        wallets: state.wallets
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        actions: bindActionCreators(WalletsActions as any, dispatch) as typeof WalletsActions
    };
}

export const Wallets = connect(mapStateToProps, mapDispatchToProps)(Wallets2);
