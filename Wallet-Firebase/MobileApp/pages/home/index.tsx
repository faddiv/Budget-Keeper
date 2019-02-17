import * as React from "react";
import * as classNames from "classnames";
import { Layout } from "layout";
import { UserModel, UserServices } from "../../walletServices/userServices";
import { RootState } from "walletServices";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import bind from "bind-decorator";
import { updateState, isClickableClicked } from "react-ext";
import { validate, ValidationState, ValidationConfig, validators } from "helpers";
// tslint:disable-next-line:no-submodule-imports
import { ToDoServices, ToDoListModel } from "walletServices/toDoServices";

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
    userServices?: typeof UserServices;
    toDoList?: ToDoListModel;
    toDoServices?: typeof ToDoServices;
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
    checkItem(evt: React.MouseEvent<HTMLElement>) {
        if (isClickableClicked(evt)) {
            return;
        }
        /*const index = parseInt(evt.currentTarget.dataset.item, 10);
        const items = [...this.state.items];
        items[index] = { ...this.state.items[index], checked: !this.state.items[index].checked };
        this.setState({
            items
        });*/
    }

    @bind
    deleteItem(evt: React.MouseEvent<HTMLElement>) {
        evt.preventDefault();
        const index = parseInt(evt.currentTarget.parentElement.parentElement.parentElement.dataset.item, 10);
        const item = this.props.toDoList.checklist[index];
        this.props.toDoServices.Remove(item);
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
    async submit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const validationState = validate(transactionRules, this.state.validation, this.state, this.props, true);
        if (!validationState.isValid) {
            const state: HomeState = { ...this.state, showError: true };
            state.validation = validationState.validationState;
            this.setState(state);
        } else {
            await this.props.toDoServices.Add({
                name: this.state.article,
                price: parseInt(this.state.price, 10),
                ok: false
            });
        }
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
        const state = updateState(event);
        this.setState(state, this.validate);
    }

    render() {
        const { validation } = this.state;
        const { toDoList } = this.props;
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
                <br />
                <ul className="list-group">
                    {toDoList.checklist.map((item, index) => (
                        <li key={item.id} className={classNames("list-group-item", { "list-group-item-success": item.ok })} data-item={index} onClick={this.checkItem}>
                            <div className="form-row">
                                <div className="col-6"><span className="fa fa-check" style={{ visibility: item.ok ? "visible" : "hidden" }}></span>&nbsp;{item.name}</div>
                                <div className="col-4"><input type="number" className="form-control form-control-xs" value={item.price} readOnly /></div>
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
        userModel: state.user,
        toDoList: state.toDoList
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userServices: bindActionCreators(UserServices as any, dispatch) as typeof UserServices,
        toDoServices: bindActionCreators(ToDoServices as any, dispatch) as typeof ToDoServices
    };
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(Home2);
