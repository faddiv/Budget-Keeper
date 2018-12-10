import * as React from "react";
import * as classNames from "classnames";
import { Layout } from "layout";
import { UserModel } from "reducers/userReducers";
import { RootState } from "reducers";
import { UserActions } from "actions/userActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import bind from "bind-decorator";
import { updateState } from "react-ext";
import { validate, ValidationState, ValidationConfig, validators } from "helpers/validation";

export const transactionRules: ValidationConfig<HomeState, any> = {
    article: {
        validators: [
            {
                validator: validators.required,
                message: "Name is reuired."
            }
        ],
        valueGetter: state => state.article
    },
    price: {
        validators: [
            {
                validator: validators.required,
                message: "Price is reuired."
            }
        ],
        valueGetter: state => state.price
    }
};

export interface HomeProps {
    userModel: UserModel;
    actions?: typeof UserActions;
}

export interface HomeState {
    article: string;
    price: string;
    result: string;
    validation: ValidationState;
    showError: boolean;
}

class Home2 extends React.Component<HomeProps, HomeState> {
    unregisterAuthObserver: () => void;

    constructor(props) {
        super(props);
        console.log("Home created");
        this.state = {
            article: "",
            price: "",
            result: "",
            showError: false,
            validation: validate(transactionRules, {}, undefined, this.props).validationState
        };
    }

    @bind
    validate() {
        const validationResult = validate(transactionRules, this.state.validation, this.state, this.props, this.state.showError);
        if (validationResult.changed) {
            this.setState({
                validation: validationResult.validationState
            });
        }
    }

    @bind
    submit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const validationState = validate(transactionRules, this.state.validation, this.state, this.props, true);
        if (!validationState.isValid) {
            const state: HomeState = { ...this.state, showError: true };
            state.validation = validationState.validationState;
            this.setState(state);
        } else {
            this.setState({
                result: `${this.state.article} ${this.state.price}`
            }, this.validate);
        }
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
        const state = updateState(event);
        this.setState(state, this.validate);
    }

    render() {
        const { validation } = this.state;
        return (
            <Layout>
                <form onChange={this.handleInputChange} onSubmit={this.submit}>
                    <div className="form-group">
                        <label htmlFor="article">Article name</label>
                        <input type="text" className={classNames("form-control", { "is-invalid": validation.article.showError })} id="article" name="article" placeholder="Article name" />
                        <div className="invalid-feedback">
                            {validation.article.message}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input type="number" className={classNames("form-control", { "is-invalid": validation.price.showError })} id="price" name="price" placeholder="Price" />
                        <div className="invalid-feedback">
                            {validation.price.message}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="result">Email</label>
                        <input type="text" readOnly className="form-control-plaintext" id="result" value={this.state.result} />
                    </div>
                    <button type="submit" className="btn btn-primary">Add</button>
                </form>
            </Layout>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        userModel: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserActions as any, dispatch) as typeof UserActions
    };
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(Home2);
