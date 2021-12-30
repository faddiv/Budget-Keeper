import { Card, Col, Form, Row } from "react-bootstrap";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ExportPageState } from "../services";

interface RangeProps {
  register: UseFormRegister<ExportPageState>;
  errors: FieldErrors<ExportPageState>;
}

export function RangeSelector({ register, errors }: RangeProps) {
  return (
    <Card.Body>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="1">
          From
        </Form.Label>
        <Col>
          <Form.Control type="date" {...register("rangeFrom", { required: true })} isInvalid={!!errors.rangeFrom} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
        <Form.Label column sm="1">
          To
        </Form.Label>
        <Col>
          <Form.Control type="date" {...register("rangeTo", { required: true })} isInvalid={!!errors.rangeTo} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
      </Form.Group>
    </Card.Body>
  );
}
