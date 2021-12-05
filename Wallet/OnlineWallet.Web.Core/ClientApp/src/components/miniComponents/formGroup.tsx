import { ValidationStateElement, noop } from "../../services/helpers";
import classNames from "classnames";
import { FunctionComponent } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FieldError } from "react-hook-form";

type InputType =
  | "text"
  | "button"
  | "submit"
  | "reset"
  | "radio"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "number"
  | "range"
  | "search"
  | "tel"
  | "time"
  | "url"
  | "week";

interface FormGroupProps {
  id?: string;
  name: string;
  label: string;
  type?: InputType;
  value?: any;
  onChange?: () => void;
  autoComplete?: boolean;
  validation?: ValidationStateElement;
  error?: FieldError | undefined;
}

export const FormGroup: FunctionComponent<FormGroupProps> = ({ id, name, label, type, value, onChange, autoComplete, validation, error, children }) => {
  id = id || name;
  return (
    <Form.Group as={Row} controlId={id} className="mb-2 align-items-baseline">
      <Form.Label column sm="2">
        {label}
      </Form.Label>
      <Col>
        {children ? children : defaultInput(type || "", id, name, label, value, onChange, autoComplete || false, validation)}
        {!!error && <Form.Control.Feedback type="invalid">{error.message || "Field is invalid"}</Form.Control.Feedback>}
      </Col>
    </Form.Group>
  );
};

function defaultInput(
  type: string,
  id: string,
  name: string,
  label: string,
  value: any,
  onChange: (() => void) | undefined,
  autoComplete: boolean,
  validation: ValidationStateElement | undefined
): Array<React.ReactElement<any>> {
  const elements: Array<React.ReactElement<any>> = [
    <input
      key={1}
      type={type}
      className={classNames("form-control", { "is-invalid": validation && validation.showError })}
      id={id}
      name={name}
      placeholder={label}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete ? undefined : "off"}
    />,
  ];
  if (validation) {
    elements.push(
      <div key={2} className="invalid-feedback">
        {validation.message}
      </div>
    );
  }
  return elements;
}

FormGroup.defaultProps = {
  type: "text",
  onChange: noop,
  autoComplete: false,
};
