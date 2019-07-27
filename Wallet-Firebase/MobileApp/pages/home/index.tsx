import * as React from "react";
import * as classNames from "classnames";
import { Layout } from "layout";
import { UserServices } from "../../walletServices/userServices";
import { RootState, ArticleModel } from "walletServices";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import bind from "bind-decorator";
import { updateState, isClickableClicked } from "react-ext";
import { validate, ValidationState, ValidationConfig, validators, noop } from "helpers";
import { ToDoActions, listenToDos, ToDoModel } from "walletServices/toDoServices";
import { ViewRow, EditRow } from "./subComponents";
import { DisplayProperty } from 'csstype';

export const transactionRules: ValidationConfig<HomeState, any> = {
    article: {
        validators: [
            {
                validator: validators.required,
                message: "Name is required."
            }
        ],
        valueGetter: state => state.article
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
    submit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const validationState = validate(transactionRules, this.state.validation, this.state, this.props, true);
        if (!validationState.isValid) {
            const state = {
                showError: true,
                validation: validationState.validationState
            };
            this.setState(state);
        } else {
            this.toDoServices.add({
                userId: this.props.userModel.uid,
                name: this.state.article,
                price: this.parsePrice(""),
                ok: false
            });
            this.setState({
                article: ""
            });
        }
    }
    @bind
    onSelect(item: ArticleModel) {
        if (item && item.lastPrice) {
            this.setState({
                article: item.name
            });
        }
    }
    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
        const state = updateState(event);
        this.setState(state, this.validate);
    }

    render() {
        const { validation, article } = this.state;
        const { toDoList } = this.props;
        const display: DisplayProperty = validation.article.showError ? "block" : "none";
        return (
            <Layout>
                <form onChange={this.handleInputChange} onSubmit={this.submit}>
                    <div className="form-row">
                        <div className="col form-group">
                            <label htmlFor="article">Article name</label>
                            <div className={"input-group"}>
                                <input
                                    name="article"
                                    value={article}
                                    onChange={noop}
                                    lang="hu"
                                    className={classNames("form-control", { "is-invalid": validation.article.showError })} />
                                <div className="input-group-append">
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                            </div>
                            <div className="invalid-feedback" style={{ display }}>
                                {validation.article.message}
                            </div>
                        </div>
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
