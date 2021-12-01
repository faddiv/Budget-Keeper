import { KeyboardEvent, useCallback } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { CellProps } from "react-table";

export function CellEditor<D extends object, V = any>({ value, endEdit }: CellProps<D, V>) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      value: value as any,
    },
  });
  const onSubmit = (data: FormData) => {
    endEdit();
  };
  const onKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Escape") {
        endEdit();
      }
    },
    [endEdit]
  );
  return (
    <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Row className="align-items-center">
        <Col>
          <Form.Control {...register("value")} autoFocus onKeyDown={onKeyDown} data-lpignore="true" />
        </Col>
      </Row>
    </Form>
  );
}

interface FormData {
  value: any;
}
