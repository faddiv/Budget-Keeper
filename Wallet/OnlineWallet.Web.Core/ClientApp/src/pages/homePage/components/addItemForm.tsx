import classNames from "classnames";
import { FormGroup } from "../../../components/MiniComponents/formGroup";
import { ArticleModel } from "../../../services/walletApi";
import { useCallback } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { CategoryInput } from "../../../components/CategoryInput";
import { NameInput } from "../../../components/NameInput";
import { WalletSelector } from "../../../components/WalletSelector";
import { TransactionViewModel, toDateString, _ } from "../../../services/helpers";
import { useForm } from "react-hook-form";
import { DirectionCheck } from "./directionCheck";

export interface AddItemFormProps {
  addLine: (model: TransactionViewModel) => void;
  saveAll: () => Promise<SaveAllResult>;
  items: TransactionViewModel[];
}

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
    reset({ ...defaultValues, key: nextId(items), direction: model.direction });
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
      reset({ ...defaultValues, key: nextId([]) });
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
        <DirectionCheck {...register("direction", { required: true })} />
      </FormGroup>
      <Row className="mb-2">
        <Col>
          <Button type="submit" variant="primary">
            Add
          </Button>
          <Button type="button" variant="success" onClick={saveAllInternal}>
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
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
