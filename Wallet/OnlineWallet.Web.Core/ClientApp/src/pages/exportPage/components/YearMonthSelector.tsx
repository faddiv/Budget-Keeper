import { Card, Col, Form, Row } from "react-bootstrap";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ExportPageState } from "../services";

interface YearMonthSelectorProps {
  register: UseFormRegister<ExportPageState>;
  errors: FieldErrors<ExportPageState>;
}

export function YearMonthSelector({ register, errors }: YearMonthSelectorProps) {
  return (
    <Card.Body>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Year/Month
        </Form.Label>
        <Col>
          <Form.Control type="number" {...register("year", { required: true })} isInvalid={!!errors.year} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
        <Col>
          <Form.Control type="number" {...register("month", { required: true })} isInvalid={!!errors.month} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
      </Form.Group>
    </Card.Body>
  );
}
