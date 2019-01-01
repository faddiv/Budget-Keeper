import * as React from "react";
import * as classNames from "classnames";
import { Layout } from "layout";
import { UserModel } from "reducers/userReducers";
import { RootState } from "reducers";
import { UserActions } from "actions/userActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import bind from "bind-decorator";
import { updateState, isClickableClicked } from "react-ext";
import { validate, ValidationState, ValidationConfig, validators, _ } from "helpers";

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

export interface IToDoElement {
    checked: boolean;
    name: string;
    price: number;
}

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
    items: IToDoElement[];
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
            validation: validate(transactionRules, {}, undefined, this.props).validationState,
            items: [
                {
                    name: "Alma",
                    price: 100,
                    checked: false
                },
                {
                    name: "Körte",
                    price: 100,
                    checked: true
                }
            ]
        };
    }

    @bind
    checkItem(evt: React.MouseEvent<HTMLElement>) {
        if (isClickableClicked(evt)) {
            return;
        }
        const index = parseInt(evt.currentTarget.dataset.item, 10);
        const items = [...this.state.items];
        items[index] = { ...this.state.items[index], checked: !this.state.items[index].checked };
        this.setState({
            items
        });
    }
    @bind
    deleteItem(evt: React.MouseEvent<HTMLElement>) {
        const index = parseInt(evt.currentTarget.parentElement.parentElement.parentElement.dataset.item, 10);
        const items = _.removeByIndex(this.state.items, index);
        this.setState({
            items
        });
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
        const { validation, items } = this.state;
        return (
            <Layout>
                <form onChange={this.handleInputChange} onSubmit={this.submit}>
                    <div className="form-row">
                        <div className="col form-group">
                            <label htmlFor="article">Article name</label>
                            <input type="text" className={classNames("form-control", { "is-invalid": validation.article.showError })} id="article" name="article" placeholder="Article name" />
                            <div className="invalid-feedback">
                                {validation.article.message}
                            </div>
                        </div>
                        <div className="col form-group">
                            <label htmlFor="price">Price</label>
                            <input type="number" className={classNames("form-control", { "is-invalid": validation.price.showError })} id="price" name="price" placeholder="Price" />
                            <div className="invalid-feedback">
                                {validation.price.message}
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                </form>
                <ul className="list-group">
                    {items.map((item, index) => (
                        <li className={classNames("list-group-item", { "list-group-item-success": item.checked })} data-item={index} onClick={this.checkItem}>
                            <div className="form-row">
                                <div className="col-6"><span className="fa fa-check" style={{ visibility: item.checked ? "visible" : "hidden" }}></span>&nbsp;{item.name}</div>
                                <div className="col-4"><input type="number" className="form-control form-control-xs" value={item.price} /></div>
                                <div className="col-2"><button className="btn btn-link" onClick={this.deleteItem}><span className="fa fa-trash fa-sm" /></button></div>
                            </div>
                        </li>
                    ))}
                </ul>
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
