import { KeyboardEvent, useCallback } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { CellProps } from "react-table";
import { WalletSelector } from "../../../../components/WalletSelector";

export function WalletEditor<D extends object>({ value, submitCell, cancelCell, cell }: CellProps<D, number | undefined>) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      value: value,
    },
  });
  const onSubmit = (data: FormData) => {
    submitCell(cell, data.value);
  };
  const onKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLSelectElement>) => {
      if (evt.key === "Escape") {
        cancelCell();
      }
      if (evt.key === "Enter") {
        evt.preventDefault();
        evt.currentTarget.form?.requestSubmit();
      }
    },
    [cancelCell]
  );
  return (
    <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <InputGroup>
        <WalletSelector {...register("value", { valueAsNumber: true })} autoFocus onKeyDown={onKeyDown} data-lpignore="true" />
        <Button variant="outline-success" type="submit">
          <span className="fa fa-check"></span>
        </Button>
      </InputGroup>
    </Form>
  );
}

interface FormData {
  value: number;
}
