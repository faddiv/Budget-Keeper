import classNames from "classnames";
import { bind } from "bind-decorator";

import { FormGroup } from "../../../components/MiniComponents/formGroup";
import { ArticleModel, CategoryModel } from "../../../services/walletApi";
import { DirectionCheck } from "./directionCheck";
import { Component, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import { CategoryInput } from "../../../components/CategoryInput";
import { NameInput } from "../../../components/NameInput";
import { WalletSelector } from "../../../components/WalletSelector";
import { transactionRules, TransactionViewModel, updateState, validate, ValidationState, toDateString, _ } from "../../../services/helpers";
import { useForm } from "react-hook-form";

export interface AddItemFormProps {
  addLine: (model: TransactionViewModel) => void;
  saveAll: () => Promise<SaveAllResult>;
  items: TransactionViewModel[];
}

export interface AddItemFormState extends TransactionViewModel {
  id: number;
  validation: ValidationState;
  showError: boolean;
}

export class AddItemForm2 extends Component<AddItemFormProps, AddItemFormState> {
  focusStart: () => void = () => {};

  constructor(props: AddItemFormProps) {
    super(props);
    this.state = this.createInitialState(1);
  }

  @bind
  handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
    const state = updateState(event);
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
      const state: AddItemFormState = { ...this.state, showError: true };
      state.validation = validationState.validationState;
      this.setState(state);
    } else {
      const item: TransactionViewModel = {
        category: this.state.category,
        comment: this.state.comment,
        createdAt: this.state.createdAt,
        direction: this.state.direction,
        name: this.state.name,
        price: this.state.price,
        walletId: this.state.walletId,
        key: this.state.key,
      };
      this.props.addLine(item);
      const state: AddItemFormState = {
        ...this.createInitialState(this.state.id + 1),
        direction: item.direction,
        walletId: item.walletId,
        createdAt: item.createdAt,
      };
      this.setState(state, () => {
        this.focusStart();
      });
    }
  }

  createInitialState(id: number) {
    const state: AddItemFormState = {
      walletId: 2,
      name: "",
      category: "",
      comment: "",
      price: "",
      direction: -1,
      createdAt: toDateString(new Date()),
      key: id,
      id,
      showError: false,
      validation: validate(transactionRules, {}, undefined, this.props).validationState,
    };
    return state;
  }

  @bind
  validate() {
    const validationResult = validate(transactionRules, this.state.validation, this.state, this.props, this.state.showError);
    if (validationResult.changed) {
      this.setState({
        validation: validationResult.validationState,
      });
    }
  }

  @bind
  nameSelected(item: ArticleModel) {
    const otherElement = _.findLast(this.props.items, (i) => i.name === item.name);
    this.setState(
      {
        name: (otherElement && otherElement.name) || item.name,
        category: (otherElement && otherElement.category) || item.category,
        price: (otherElement && otherElement.price) || item.lastPrice?.toString(10),
        walletId: (otherElement && otherElement.walletId) || item.lastWallet,
      },
      this.validate
    );
  }

  @bind
  categorySelected(model: CategoryModel) {
    this.setState({
      category: model.name,
    });
  }

  @bind
  async saveAll() {
    const result = await this.props.saveAll();
    if (result === "success") {
      this.setState(this.createInitialState(1));
    }
  }

  render() {
    const { category, comment, createdAt, direction, name, price, walletId, validation } = this.state;
    return (
      <Form onChange={this.handleInputChange} onSubmit={this.addLine}>
        <FormGroup name="walletId" label="Wallet">
          <WalletSelector value={walletId || 0} />
        </FormGroup>
        <FormGroup name="name" label="Name">
          <NameInput value={name || ""} autoFocus={true} onSelect={this.nameSelected} className={classNames({ "is-invalid": validation.name.showError })} />
        </FormGroup>
        <FormGroup name="price" label="Price" type="number" value={price} validation={validation.price} />
        <FormGroup name="category" label="Category" value={category}>
          <CategoryInput value={category || ""} onSelect={this.categorySelected} />
        </FormGroup>
        <FormGroup name="createdAt" label="Date" type="date" value={createdAt} />
        <FormGroup name="comment" label="Comment" value={comment} />
        <DirectionCheck value={direction || 0} />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
        <button type="button" className="btn btn-success" onClick={this.saveAll}>
          Save
        </button>
      </Form>
    );
  }
}

export type SaveAllResult = "success" | "fail";

function nextId(items: TransactionViewModel[]) {
  if (items.length === 0) return 1;
  return items.reduce((prec, next) => Math.max(prec, next.key || 0), 0) + 1;
}
const defaultValues: TransactionViewModel = {
  walletId: 2,
  name: "",
  category: "",
  comment: "",
  price: "",
  direction: -1,
  createdAt: toDateString(new Date()),
};
export function AddItemForm({ addLine, items, saveAll }: AddItemFormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    setFocus,
  } = useForm({
    defaultValues: { ...defaultValues, key: nextId(items) },
  });
  const onSubmit = handleSubmit((model) => {
    model.key = nextId(items);
    addLine(model);
    reset();
    setFocus("name");
  });
  const nameSelected = useCallback(
    (item: ArticleModel) => {
      const otherElement = _.findLast(items, (i) => i.name === item.name);
      setValue("category", (otherElement && otherElement.category) || item.category);
      setValue("price", (otherElement && otherElement.price) || item.lastPrice?.toString(10), { shouldValidate: true });
      setValue("walletId", (otherElement && otherElement.walletId) || item.lastWallet);
    },
    [items, setValue]
  );
  const saveAllInternal = useCallback(async () => {
    const result = await saveAll();
    if (result === "success") {
      reset();
      setFocus("name");
    }
  }, [reset, saveAll, setFocus]);
  return (
    <Form onSubmit={onSubmit} noValidate>
      <FormGroup name="walletId" label="Wallet" error={errors.walletId}>
        <WalletSelector {...register("walletId", { required: true })} isInvalid={!!errors.walletId} />
      </FormGroup>
      <FormGroup name="name" label="Name" error={errors.name}>
        <NameInput {...register("name", { required: true })} autoFocus={true} onSelect={nameSelected} className={classNames({ "is-invalid": errors.name })} />
      </FormGroup>
      <FormGroup name="price" label="Price" error={errors.price}>
        <Form.Control type="number" {...register("price", { required: true })} isInvalid={!!errors.price} />
      </FormGroup>
      <FormGroup name="category" label="Category">
        <CategoryInput {...register("category")} className={classNames({ "is-invalid": errors.category })} />
      </FormGroup>
      <FormGroup name="createdAt" label="Date" error={errors.createdAt}>
        <Form.Control type="date" {...register("createdAt", { required: true })} isInvalid={!!errors.createdAt} />
      </FormGroup>
      <FormGroup name="comment" label="Comment">
        <Form.Control {...register("comment")} />
      </FormGroup>
      <FormGroup name="direction" label="Type">
        <DirectionCheck {...register("direction", { valueAsNumber: true })} />
      </FormGroup>
      <Button type="submit" variant="primary">
        Add
      </Button>
      <Button type="button" variant="success" onClick={saveAllInternal}>
        Save
      </Button>
    </Form>
  );
}
