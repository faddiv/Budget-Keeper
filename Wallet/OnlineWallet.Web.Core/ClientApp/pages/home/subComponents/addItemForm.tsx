import * as React from 'react';
import { FormGroup } from 'common/misc';
import { bind, updateState, className } from 'walletCommon';
import { getDirectionColoring } from 'common/transactions-view';
import { validate, ValidationState } from 'walletCommon/validation';
import { transactionRules, TransactionViewModel, toDateString } from 'common/models';
import { WalletSelector, NameInput, CategoryInput } from 'common/specialInputs';
import { Wallet, ArticleModel, CategoryModel } from 'walletApi';
import { DirectionCheck } from './directionCheck';

export namespace AddItemForm {
    export interface Props {
        addLine: (model: TransactionViewModel) => void;
        saveAll: () => Promise<SaveAllResult>;
        wallets: Wallet[];
    }
    export interface State extends TransactionViewModel {
        id: number;
        validation: ValidationState;
        showError: boolean;
    }
}

export class AddItemForm extends React.Component<AddItemForm.Props, AddItemForm.State> {

    focusStart: () => void;

    constructor(props) {
        super(props);
        this.state = this.createInitialState(1);
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
        this.setState(state, this.validate);
    }

    @bind
    focusStartBind(focusMethod: () => void) {
        this.focusStart = focusMethod;
    }

    @bind
    addLine(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationState = validate(transactionRules, this.state.validation, this.state, this.props, true);
        if (!validationState.isValid) {
            let state: AddItemForm.State = { ...this.state, showError: true };
            state.validation = validationState.validationState;
            this.setState(state);
        } else {
            var item: TransactionViewModel = {
                category: this.state.category,
                comment: this.state.comment,
                createdAt: this.state.createdAt,
                direction: this.state.direction,
                name: this.state.name,
                price: this.state.price,
                walletId: this.state.walletId,
                key: this.state.key
            };
            this.props.addLine(item);
            let state: AddItemForm.State = {
                ...this.createInitialState(this.state.id + 1),
                direction: item.direction,
                walletId: item.walletId,
                createdAt: item.createdAt
            };
            this.setState(state, () => {
                this.focusStart();
            });
        }
    }

    private createInitialState(id: number) {
        let state: AddItemForm.State = {
            walletId: 2,
            name: "",
            category: "",
            comment: "",
            price: "",
            direction: -1,
            createdAt: toDateString(new Date()),
            key: id,
            id: id,
            showError: false,
            validation: validate(transactionRules, {}, undefined, this.props).validationState
        };
        return state;
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
    nameSelected(item: ArticleModel) {
        this.setState({
            name: item.name,
            category: item.category,
            price: item.lastPrice.toString(10),
        }, this.validate);
    }

    @bind
    categorySelected(model: CategoryModel) {
        this.setState({
            category: model.name
        });
    }

    @bind
    async saveAll() {
        var result = await this.props.saveAll();
        if(result === "success") {
            this.setState((prevState, props) => {
                return this.createInitialState(1);
            });
        }
    }

    render() {
        const { wallets, saveAll } = this.props;
        const { category, comment, createdAt, direction, name, price, walletId, validation } = this.state;
        return (
            <form onChange={this.handleInputChange} onSubmit={this.addLine}>
            <FormGroup name="walletId" label="Wallet">
                <WalletSelector walletId={walletId} wallets={wallets} />
            </FormGroup>
            <FormGroup name="createdAt" label="Date" type="date" value={createdAt} />
            <FormGroup name="name" label="Name">
                <NameInput focusAction={this.focusStartBind}
                    value={name} autoFocus={true} onSelect={this.nameSelected}
                    className={className("form-control", validation.name.showError, "is-invalid")} >
                    <div className="invalid-feedback">
                        {validation.name.message}
                    </div>
                </NameInput>
            </FormGroup>
            <FormGroup name="price" label="Price" type="number" value={price} validation={validation.price} />
            <FormGroup name="comment" label="Comment" value={comment} />
            <FormGroup name="category" label="Category" value={category}>
                <CategoryInput value={category} className="form-control" onSelect={this.categorySelected} />
            </FormGroup>
            <DirectionCheck value={direction} />
            <button type="submit" className="btn btn-primary">Add</button>
            <button type="button" className="btn btn-success" onClick={this.saveAll}>Save</button>
        </form>
        );
    }
}

export type SaveAllResult = "success" | "fail";