import { forwardRef } from "react";
import { Form, FormCheckProps } from "react-bootstrap";

function DirectionCheckInt(params: FormCheckProps, ref: React.ForwardedRef<HTMLInputElement>) {
  return (
    <>
      <Form.Check id="expense-radio" type="radio" inline value={-1} label="Expense" ref={ref} {...params} />
      <Form.Check id="plan-radio"  type="radio" inline value={0} label="Plan" ref={ref} {...params} />
      <Form.Check id="salary-radio"  type="radio" inline value={1} label="Salary" ref={ref} {...params} />
    </>
  );
}
export const DirectionCheck = forwardRef(DirectionCheckInt);
