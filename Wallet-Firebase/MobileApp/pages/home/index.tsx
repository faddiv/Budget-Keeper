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
import { ViewRow, EditRow } from "./subComponents";

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
    editIndex: number | null;
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
            validation: validate(transactionRules, {}, undefined, this.props).validationState,
            editIndex: null
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
    remove(item: ToDoModel) {
        this.toDoServices.remove(item);
    }

    @bind
    edit(index: number) {
        this.setState({ editIndex: index });
    }

    @bind
    cancel() {
        this.setState({ editIndex: null });
    }

    @bind
    save(newItem: ToDoModel) {
        this.toDoServices.update(newItem);
        this.setState({ editIndex: null });
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
            const state = {
                showError: true,
                validation: validationState.validationState
            };
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
                    {toDoList.checklist.map(this.renderRow)}
                </ul>
            </Layout>
        );
    }

    @bind
    renderRow(item: ToDoModel, index: number) {
        const { editIndex } = this.state;
        if (editIndex === index) {
            return (
                <li key={item.id} className={classNames("list-group-item", { "list-group-item-success": item.ok })} data-item={index}>
                    <EditRow item={item} index={index} save={this.save} cancel={this.cancel} />
                </li>
            );
        } else {
            return (
                <li key={item.id} className={classNames("list-group-item", { "list-group-item-success": item.ok })} data-item={index} onClick={this.checkItem}>
                    <ViewRow item={item} index={index} remove={this.remove} edit={this.edit} />
                </li>
            );
        }
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
