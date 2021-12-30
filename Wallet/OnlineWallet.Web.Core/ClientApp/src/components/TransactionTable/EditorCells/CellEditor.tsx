import { KeyboardEvent, useCallback } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { CellProps } from "react-table";

export function createCellEditor<D extends object, V = any>(type: string) {
  const CellEditor = ({ value, submitCell, cancelCell, cell }: CellProps<D, V>) => {
    const { register, handleSubmit } = useForm<FormData>({
      defaultValues: {
        value: value as any,
      },
    });
    const onSubmit = (data: FormData) => {
      submitCell(cell, data.value);
    };
    const onKeyDown = useCallback(
      (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === "Escape") {
          cancelCell();
        }
      },
      [cancelCell]
    );
    return (
      <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <InputGroup>
          <Form.Control type={type} {...register("value")} autoFocus onKeyDown={onKeyDown} data-lpignore="true" />
          <Button variant="outline-success" type="submit">
            <span className="fa fa-check"></span>
          </Button>
        </InputGroup>
      </Form>
    );
  };

  return CellEditor;
}

interface FormData {
  value: any;
}
