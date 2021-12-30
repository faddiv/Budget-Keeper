import { CellProps } from "react-table";
import Select, { SingleValue } from "react-select";
import { DirectionIcon } from "../../MiniComponents/DirectionIcon";
import { useController, useForm } from "react-hook-form";
import { KeyboardEvent, useCallback } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import Input from "../../MiniComponents/InputForSelect";

const options = [
  {
    value: -1,
    label: <DirectionIcon direction={-1} />,
  },
  {
    value: 0,
    label: <DirectionIcon direction={0} />,
  },
  {
    value: 1,
    label: <DirectionIcon direction={1} />,
  },
];
type OptionType = typeof options[0];

export function DirectionEditor<D extends object>({ value, submitCell, cancelCell, cell }: CellProps<D, number>) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      value: value,
    },
  });
  const onSubmit = (data: FormData) => {
    submitCell(cell, data.value);
  };
  const onKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLDivElement>) => {
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
    (selected: SingleValue<OptionType>) => {
      onChange(selected?.value || null);
    },
    [onChange]
  );
  const option = options.find((e) => e.value === fieldValue);
  return (
    <Form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <InputGroup>
        <Select
          ref={ref}
          value={option}
          name={name}
          options={options}
          onChange={intermediateChangeHandler}
          onBlur={onBlur}
          components={{ Input }}
          onKeyDown={onKeyDown}
        />
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
