import { ChangeEvent, forwardRef, RefObject, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { UseFormRegisterReturn } from "react-hook-form";
import { MoneyDirection } from "../../../services/walletApi";

function DirectionCheckInt({ name, onChange, onBlur }: UseFormRegisterReturn, ref: React.ForwardedRef<any>) {
  const [checked, setChecked] = useState<MoneyDirection | null>(null);
  const expenseRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);
  const salaryRef = useRef<HTMLInputElement>(null);
  const getValue = useCallback(() => {
    if (isChecked(expenseRef)) return MoneyDirection.Expense;
    if (isChecked(planRef)) return MoneyDirection.Plan;
    if (isChecked(salaryRef)) return MoneyDirection.Income;
    return null;
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      get value(): MoneyDirection | null {
        return getValue();
      },
      set value(newValue: MoneyDirection | null) {
        setChecked(newValue);
      },
      focus() {},
    }),
    [getValue]
  );
  const changeHandler = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const value = getValue();
      const event = {
        target: {
          name,
          value: value,
        },
        type: "change",
      };
      onChange(event);
      setChecked(value);
    },
    [getValue, name, onChange]
  );

  const blurHandler = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const event = {
        target: {
          name,
          value: getValue(),
        },
        type: "blur",
      };
      onBlur(event);
    },
    [getValue, name, onBlur]
  );
  return (
    <>
      <Form.Check
        id="expense-radio"
        name={name}
        type="radio"
        inline
        label="Expense"
        ref={expenseRef}
        checked={checked === MoneyDirection.Expense}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
      <Form.Check
        id="plan-radio"
        name={name}
        type="radio"
        inline
        label="Plan"
        ref={planRef}
        checked={checked === MoneyDirection.Plan}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
      <Form.Check
        id="salary-radio"
        name={name}
        type="radio"
        inline
        label="Salary"
        ref={salaryRef}
        checked={checked === MoneyDirection.Income}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
    </>
  );
}
export const DirectionCheck = forwardRef(DirectionCheckInt);
function isChecked(ref: RefObject<HTMLInputElement>) {
  return ref.current?.checked || false;
}
