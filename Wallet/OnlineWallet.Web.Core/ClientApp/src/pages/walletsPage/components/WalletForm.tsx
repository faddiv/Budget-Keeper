import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { insertWallet } from "../../../services/actions/wallets";
import { Wallet } from "../../../services/walletApi";

export function WalletForm() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Wallet>({
    defaultValues: {
      moneyWalletId: 0,
      name: "",
    },
  });

  const insertRow = handleSubmit(async (submitData: Wallet) => {
    await dispatch(insertWallet(submitData));
  });

  return (
    <Form onSubmit={insertRow} noValidate>
      <Form.Group as={Row} controlId="name">
        <Form.Label column xs="2">
          Name
        </Form.Label>
        <Col>
          <Form.Control {...register("name", { required: true })} isInvalid={!!errors.name} />
          {!!errors.name && <Form.Control.Feedback type="invalid">{errors.name.message || "Field is invalid"}</Form.Control.Feedback>}
        </Col>
        <Col xs="auto">
          <Button type="submit" variant="primary">
            Add
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
}
