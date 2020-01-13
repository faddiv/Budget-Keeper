import React from "react";
import classNames from "classnames";
import { Layout } from "../../layout";
import { UserServices } from "../../walletServices/userServices";
import { RootState, ArticleModel } from "../../walletServices";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { updateState, isClickableClicked } from "../../react-ext";
import { validate, ValidationState, ValidationConfig, validators, noop } from "../../helpers";
import { ToDoActions, listenToDos, ToDoModel } from "../../walletServices/toDoServices";
import { ViewRow, EditRow } from "./subComponents";
import { DisplayProperty } from 'csstype';
import { Form, FormGroup, Label, InputGroup, InputGroupAddon, Input, FormFeedback, ListGroup, ListGroupItem } from 'reactstrap';

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
    unregisterToDoListener?: () => void | undefined;

    constructor(props: HomeProps) {
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
        let target: HTMLElement | null = evt.currentTarget;
        while (target && target.tagName !== "LI") {
            target = target.parentElement;
        }
        if (!target || !target.dataset.item) return undefined;
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
        this.unregisterToDoListener && this.unregisterToDoListener();
    }

    checkItem = (evt: React.MouseEvent<HTMLElement>) => {
        if (isClickableClicked(evt)) {
            return;
        }
        evt.preventDefault();
        const item = this.getItemByEvt(evt);
        if (!item) return;
        const ok = !item.ok;
        const newItem: ToDoModel = { ...item, ok, checkedDate: ok ? new Date() : null };
        this.toDoServices.update(newItem);
    }

    remove = (item: ToDoModel) => {
        this.toDoServices.remove(item);
    }

    edit = (index: number) => {
        this.setState({ editIndex: index });
    }

    cancel = () => {
        this.setState({ editIndex: null });
    }

    save = (newItem: ToDoModel) => {
        this.toDoServices.update(newItem);
        this.setState({ editIndex: null });
    }

    validate = () => {
        const validationResult = validate(transactionRules, this.state.validation, this.state, this.props, this.state.showError);
        if (validationResult.changed) {
            this.setState({
                validation: validationResult.validationState
            });
        }
    }

    submit = (event: React.ChangeEvent<HTMLFormElement>) => {
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
                checkedDate: null,
                ok: false
            });
            this.setState({
                article: ""
            });
        }
    }

    onSelect = (item: ArticleModel) => {
        if (item && item.lastPrice) {
            this.setState({
                article: item.name || ""
            });
        }
    }

    handleInputChange = (event: React.SyntheticEvent<HTMLFormElement>) => {
        const state = updateState(event);
        this.setState(state, this.validate);
    }

    render() {
        const { validation, article } = this.state;
        const { toDoList } = this.props;
        const display: DisplayProperty = validation.article.showError ? "block" : "none";
        return (
            <Layout>
                <Form onChange={this.handleInputChange} onSubmit={this.submit}>
                    <FormGroup>
                        <Label for="article">Article name</Label>
                        <InputGroup>
                            <Input
                                id="article"
                                name="article"
                                value={article}
                                onChange={noop}
                                lang="hu"
                                placeholder="Article name"
                                invalid={validation.article.showError} />
                            <InputGroupAddon addonType="append">
                                <button type="submit" className="btn btn-primary">Add</button>
                            </InputGroupAddon>
                        </InputGroup>
                        <FormFeedback style={{ display }}>{validation.article.message}</FormFeedback>
                    </FormGroup>
                </Form>
                <br />
                <ListGroup>
                    {toDoList.checklist.map(this.renderRow)}
                </ListGroup>
            </Layout>
        );
    }

    renderRow = (item: ToDoModel, index: number) => {
        const { editIndex } = this.state;
        if (editIndex === index) {
            return (
                <ListGroupItem key={item.id} className={classNames({ "list-group-item-success": item.ok })} data-item={index}>
                    <EditRow item={item} index={index} save={this.save} cancel={this.cancel} />
                </ListGroupItem>
            );
        } else {
            return (
                <ListGroupItem key={item.id} className={classNames({ "list-group-item-success": item.ok })} data-item={index} onClick={this.checkItem}>
                    <ViewRow item={item} index={index} remove={this.remove} edit={this.edit} />
                </ListGroupItem>
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

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        userServices: bindActionCreators(UserServices, dispatch),
        toDoServices: bindActionCreators(ToDoActions, dispatch)
    };
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(Home2);
