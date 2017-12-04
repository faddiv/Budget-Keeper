import * as React from 'react';
import * as moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AlertsActions from "actions/alerts"
import { walletService, Wallet, Transaction, MoneyDirection, transactionService, ArticleModel, CategoryModel } from "walletApi";
import { Layout } from 'layout';
import { TransactionTable, getDirectionColoring } from 'common/transactions-view';
import { bind, updateState, ListHelpers, className } from 'walletCommon';
import { FormGroup, Autocomplete } from 'common/misc';
import { toDateString, TransactionViewModel, mapTransaction, getWalletNameById } from 'common/models';
import { DirectionCheck } from 'pages/home/directionCheck';
import { RootState } from 'reducers';
import { validate, initValidationState, ValidationConfig, ValidationStates } from 'walletCommon/validation';
import * as validators from 'walletCommon/validation/commonValidators';
import { WalletSelector, NameInput, CategoryInput } from 'common/specialInputs';

export namespace Home {
    export interface Props {
        wallets: Wallet[];
        actions?: typeof AlertsActions,
    }

    export interface State {
        items: TransactionViewModel[];
        newItem: TransactionViewModel;
        id: number;
        rules: ValidationConfig<State, Props>;
        validation: ValidationStates;
        showError: boolean;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class Home extends React.Component<Home.Props, Home.State> {
    focusStart: () => void;

    /**
     *
     */
    constructor() {
        super();
        this.state = {
            items: [],
            newItem: this.emptyItem(1),
            id: 1,
            rules: {
                name: {
                    validator: validators.required,
                    valueGetter: state => state.newItem.name,
                    message: "Name is reuired.",
                    getShowError: (valstate, st) => valstate.isDirty || st.showError
                },
                price: {
                    validator: validators.required,
                    valueGetter: state => state.newItem.price,
                    message: "Price is reuired.",
                    getShowError: (valstate, st) => valstate.isDirty || st.showError
                }
            },
            validation: {},
            showError: false
        };
        initValidationState(this.state.rules, this.state.validation, this.state, this.props);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.confirmLeave);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.confirmLeave);
    }

    get alertsService() {
        return this.props.actions;
    }

    @bind
    confirmLeave(event: BeforeUnloadEvent) {
        if (this.needLeaveConfirmation()) {
            event.returnValue = leaveConfirmation;
            return leaveConfirmation;
        }
    }

    @bind
    deleteRow(item: TransactionViewModel) {
        this.setState((prevState, props) => {
            return {
                items: ListHelpers.remove(prevState.items, item),
            };
        });
    }

    @bind
    updateRow(items: TransactionViewModel[]) {
        this.setState((prevState, props) => {
            return {
                items: items,
            };
        });
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
        var state = updateState(event);
        if (state.walletId) {
            state.walletId = parseInt(state.walletId, 10);
        }
        if (state.direction) {
            state.direction = parseInt(state.direction, 10);
        }
        this.setState((prevState, props) => {
            var newItem = { ...prevState.newItem, ...state };
            newItem.cssClass = getDirectionColoring(newItem);
            return {
                newItem
            };
        }, this.validate);
    }

    @bind
    nameSelected(item: ArticleModel) {
        this.setState((prevState, props) => {
            return {
                newItem: {
                    ...prevState.newItem,
                    name: item.name,
                    category: item.category,
                    price: item.lastPrice,
                }
            };
        }, this.validate);
    }

    @bind
    categorySelected(model: CategoryModel) {
        this.setState((prevState, props) => {
            return {
                newItem: { 
                    ...prevState.newItem, 
                    category: model.name 
                }
            };
        });
    }

    @bind
    async validate() {
        const validationResult = await validate(this.state.rules, this.state.validation, this.state, this.props);
        if (validationResult.changed) {
            this.setState({
                validation: validationResult.validationState
            });
        }
    }
    @bind
    async addLine(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        var state: Home.State = { ...this.state, showError: true };

        const validationState = await validate(state.rules, state.validation, state, this.props);
        state.validation = validationState.validationState;
        if (!validationState.isValid) {
            this.setState(state);
        } else {
            var item: TransactionViewModel = {
                ...state.newItem
            };
            state.items = [...state.items, state.newItem];
            state.newItem = {
                ...state.newItem,
                name: "",
                category: "",
                comment: "",
                price: "",
                key: state.id + 1
            };
            state.id = state.id + 1;
            state.showError = false;
            initValidationState(state.rules, state.validation, state, this.props);
            this.setState(state, () => {
                this.focusStart();
            });
        }
    }

    @bind
    async saveAll() {
        try {
            this.alertsService.dismissAllAlert();
            if (!this.state.items.length) {
                this.alertsService.showAlert({ type: "warning", message: "Nothing to save" });
                return;
            }
            var serverItems = mapTransaction(this.state.items);
            var result = await transactionService.batchUpdate(serverItems);
            this.alertsService.showAlert({ type: "success", message: "Transactions are saved successfully." });
            this.setState({
                items: [],
                newItem: this.emptyItem(1),
                id: 1
            });
        } catch (e) {
            this.alertsService.showAlert({ type: "danger", message: e.message });
        }
    }

    needLeaveConfirmation() {
        return this.state.items.length > 0;
    }
    /* Something is wrong:
    <FormGroup name="createdAt" label="Date">
        <input type="text" className="form-control" id="createdAt" name="createdAt" value={this.state.newItem.createdAt} />
    </FormGroup>
    */
    render() {
        const { validation, showError } = this.state;
        return (
            <Layout leaveConfirmation={{ when: this.needLeaveConfirmation(), message: leaveConfirmation }}>
                <form onChange={this.handleInputChange} onSubmit={this.addLine}>
                    <FormGroup name="walletId" label="Wallet">
                        <WalletSelector walletId={this.state.newItem.walletId} wallets={this.props.wallets} />
                    </FormGroup>
                    <FormGroup name="createdAt" label="Date" type="date" value={this.state.newItem.createdAt} />
                    <FormGroup name="name" label="Name">
                        <NameInput focusAction={(focus) => this.focusStart = focus}
                            value={this.state.newItem.name} autoFocus={true} onSelect={this.nameSelected}
                            className={className("form-control", validation.name.showError, "is-invalid")} >
                            <div className="invalid-feedback">
                                {validation.name.message}
                            </div>
                        </NameInput>
                    </FormGroup>
                    <FormGroup name="price" label="Price" type="number" value={this.state.newItem.price} validation={validation.price} />
                    <FormGroup name="comment" label="Comment" value={this.state.newItem.comment} />
                    <FormGroup name="category" label="Category" value={this.state.newItem.category}>
                        <CategoryInput value={this.state.newItem.category} className="form-control" onSelect={this.categorySelected} />
                    </FormGroup>
                    <DirectionCheck value={this.state.newItem.direction} />
                    <button type="submit" className="btn btn-primary">Add</button>
                    <button type="button" className="btn btn-success" onClick={this.saveAll}>Save</button>
                </form>
                <TransactionTable
                    items={this.state.items} wallets={this.props.wallets}
                    deleted={this.deleteRow} update={this.updateRow} rowColor={getDirectionColoring} />
            </Layout>
        );
    }

    private emptyItem(id: number): TransactionViewModel {
        return {
            walletId: 2,
            createdAt: toDateString(new Date()),
            direction: MoneyDirection.Expense,
            name: "",
            price: "",
            comment: "",
            category: "",
            key: id
        };
    }
}

function mapStateToProps(state: RootState, ownProps: any) {
    return {
        wallets: state.wallets
    };
}

function mapDispatchToProps(dispatch, ownProps: any) {
    return {
        actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}

const leaveConfirmation = "There are added items. Are you sure leaving?";