import { KeyboardEvent, useCallback } from "react";
import { Col, Form, InputGroup, Row, Button } from "react-bootstrap";
import { useController, useForm } from "react-hook-form";
import { CellProps } from "react-table";
import { ArticleModel } from "../../../../walletApi";
import { NameInput } from "../../../specialInputs";
import styles from "./NameEditor.module.scss";

export function NameEditor<D extends object>({ value, submitCell, cancelCell, cell }: CellProps<D, string>) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      value: value,
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
  const { field } = useController({
    control,
    name: "value",
  });
  const { name, onBlur, onChange, ref, value: fieldValue } = field;
  const intermediateChangeHandler = useCallback(
    (selected: ArticleModel) => {
      onChange(selected.name);
    },
    [onChange]
  );
  return (
    <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <InputGroup>
        <NameInput
          ref={ref}
          name={name}
          value={fieldValue}
          onSelect={intermediateChangeHandler}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={styles.editor}
          autoFocus
        />
        <Button variant="outline-success" type="submit">
          <span className="fa fa-check"></span>
        </Button>
      </InputGroup>
    </Form>
  );
}

interface FormData {
  value: string;
}
