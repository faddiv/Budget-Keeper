import * as moment from "moment";
import * as React from "react";
import * as classNames from "classnames";
import { Layout } from "layout";
import { UserServices } from "../../walletServices/userServices";
import { RootState } from "walletServices";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import bind from "bind-decorator";
import { updateState, isClickableClicked } from "react-ext";
import { validate, ValidationState, ValidationConfig, validators, noop } from "helpers";
import { ToDoActions, listenToDos, ToDoModel } from "walletServices/toDoServices";

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

export interface HomeProps extends ReturnType<typeof mapDispatchToProps>, ReturnType<typeof mapStateToProps> {
}

export interface HomeState {
    article: string;
    price: string;
    result: string;
    validation: ValidationState;
    showError: boolean;
}

class Home2 extends React.Component<HomeProps, HomeState> {
    unregisterToDoListener: () => void;

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

    private getItemByEvt<TElement extends HTMLElement>(evt: React.SyntheticEvent<TElement>) {
        let target: HTMLElement = evt.currentTarget;
        while (target && target.tagName !== "LI") {
            target = target.parentElement;
        }
        const index = parseInt(target.dataset.item, 10);
        const item = this.props.toDoList.checklist[index];
        return item;
    }

    private get toDoServices() {
        return this.props.toDoServices;
    }

    private parsePrice(priceStr: string) {
        return priceStr ? parseInt(priceStr, 10) : null;
    }

    componentDidMount() {
        this.unregisterToDoListener = listenToDos();
    }

    componentWillUnmount() {
        this.unregisterToDoListener();
    }

    @bind
    checkItem(evt: React.MouseEvent<HTMLElement>) {
        if (isClickableClicked(evt)) {
            return;
        }
        evt.preventDefault();
        const item = this.getItemByEvt(evt);
        const ok = !item.ok;
        const newItem: ToDoModel = { ...item, ok, checkedDate: ok ? new Date() : null };
        this.toDoServices.update(newItem);
    }

    @bind
    deleteItem(evt: React.MouseEvent<HTMLElement>) {
        evt.preventDefault();
        const item = this.getItemByEvt(evt);
        this.toDoServices.remove(item);
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
            await this.toDoServices.add({
                userId: this.props.userModel.uid,
                name: this.state.article,
                price: this.parsePrice(this.state.price),
                ok: false
            });
            this.setState({
                article: "",
                price: ""
            });
        }
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
        const state = updateState(event);
        this.setState(state, this.validate);
    }

    @bind
    handleInputChangeInTable(event: React.SyntheticEvent<HTMLInputElement>) {
        const state = updateState(event);
        const item = this.getItemByEvt(event);
        state.price = this.parsePrice(state.price);
        this.toDoServices.update({
            ...item, ...state
        });
    }

    render() {
        const { validation, article, price: newPrice } = this.state;
        const { toDoList } = this.props;
        return (
            <Layout>
                <form onChange={this.handleInputChange} onSubmit={this.submit}>
                    <div className="form-row">
                        <div className="col form-group">
                            <label htmlFor="article">Article name</label>
                            <input type="text"
                                className={classNames("form-control", { "is-invalid": validation.article.showError })}
                                id="article" name="article"
                                placeholder="Article name"
                                value={article}
                                onChange={noop} />
                            <div className="invalid-feedback">
                                {validation.article.message}
                            </div>
                        </div>
                        <div className="col form-group">
                            <label htmlFor="price">Price</label>
                            <input type="number"
                                className={classNames("form-control", { "is-invalid": validation.price.showError })}
                                id="price" name="price"
                                placeholder="Price"
                                value={newPrice}
                                onChange={noop} />
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
                    {toDoList.checklist.map(({ id, name, ok, price, checkedDate }, index) => (
                        <li key={id} className={classNames("list-group-item", { "list-group-item-success": ok })} data-item={index} onClick={this.checkItem}>
                            <div className="form-row">
                                <div className="col-6"><span className="fa fa-check" style={{ visibility: ok ? "visible" : "hidden" }}></span>&nbsp;{name}</div>
                                <div className="col-6"><input type="number" name="price" className="form-control form-control-xs" value={price || ""} onChange={this.handleInputChangeInTable} /></div>
                            </div>
                            <div className="form-row">
                                <div className="col-10">{checkedDate && moment(checkedDate).format("L")}</div>
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
        userServices: bindActionCreators(UserServices, dispatch),
        toDoServices: bindActionCreators(ToDoActions, dispatch)
    };
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(Home2);
