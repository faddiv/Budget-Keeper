import { ForwardedRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { ChangeHandler } from "react-hook-form";
import { OnChangeValue, SelectInstance } from "react-select";

export interface SelectOption<TModel extends { name: string }> {
  value: TModel;
  label: string;
}

export function useSelectExt<TModel extends { name: string }>(
  value: string | undefined,
  empty: TModel,
  ref: ForwardedRef<any> = null,
  onSelect?: (selected: TModel) => void,
  onChange?: ChangeHandler,
  name?: string
) {
  const selectRef = useRef<SelectInstance<SelectOption<TModel>> | null>(null);
  const [selected, setSelected] = useState<SelectOption<TModel> | null>(null);

  const fireHandlers = useCallback(
    (newValue: TModel) => {
      if (onChange) {
        const event = {
          target: {
            name,
            value: newValue.name,
          },
          type: "change",
        };
        onChange(event);
      }
      onSelect && onSelect(newValue);
    },
    [name, onChange, onSelect]
  );
  const changeHandler = useCallback(
    (newValue: OnChangeValue<SelectOption<TModel>, false>) => {
      setSelected(newValue);
      if (!newValue) {
        fireHandlers(Object.assign({}, empty, { name: "" }));
        return;
      }
      fireHandlers(newValue.value);
    },
    [empty, fireHandlers]
  );

  const createHandler = useCallback(
    (inputValue: string) => {
      const newValue = Object.assign({}, empty, { name: inputValue });
      setSelected({
        value: newValue,
        label: inputValue,
      });
      fireHandlers(newValue);
    },
    [empty, fireHandlers]
  );

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      },
      get value() {
        if (!selectRef.current) return "";
        const selectedOption = selectRef.current.getValue()[0];
        if (!selectedOption) return "";
        return selectedOption.label;
      },
      set value(newValue: any) {
        if (!selectRef.current) return;
        const selectedOption = selectRef.current.getValue()[0];
        const oldValue = selectedOption?.label || "";
        if (newValue !== oldValue) {
          if (newValue === "") {
            selectRef.current.clearValue();
          } else {
            selectRef.current.setValue(
              {
                value: Object.assign({}, empty, { name: newValue }),
                label: newValue,
              },
              "select-option"
            );
          }
        }
      },
    }),
    [empty]
  );

  return { changeHandler, createHandler, selectRef: selectRef, selected };
}
