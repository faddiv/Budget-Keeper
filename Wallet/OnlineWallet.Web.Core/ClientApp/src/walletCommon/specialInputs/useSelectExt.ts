import { useCallback, useEffect, useRef, useState } from "react";
import { OnChangeValue, SelectInstance } from "react-select";

export interface SelectOption<TModel extends { name: string }> {
  value: TModel;
  label: string;
}

export function useSelectExt<TModel extends { name: string }>(value: string, empty: TModel, onSelect?: (selected: TModel) => void) {
  const selectRef = useRef<SelectInstance<SelectOption<TModel>>>(null);
  const [selected, setSelected] = useState<SelectOption<TModel> | null>(null);
  
  const changeHandler = useCallback(
    (newValue: OnChangeValue<SelectOption<TModel>, false>) => {
      setSelected(newValue);
      if (!newValue) {
        onSelect && onSelect(Object.assign({ name: "" }, empty));
        return;
      }
      onSelect && onSelect(newValue.value);
    },
    [empty, onSelect]
  );

  const createHandler = useCallback(
    (inputValue: string) => {
      const newValue = Object.assign({ name: inputValue }, empty);
      setSelected({
        value: newValue,
        label: inputValue,
      });
      onSelect && onSelect(newValue);
    },
    [empty, onSelect]
  );

  useEffect(() => {
    if (!selectRef.current) return;
    if (!value) {
      selectRef.current.clearValue();
    } else if (!selected || value !== selected.label) {
      selectRef.current.setValue(
        {
          value: Object.assign({ name: value }, empty),
          label: value,
        },
        "select-option"
      );
    }
  }, [empty, selected, value]);

  return { changeHandler, createHandler, selectRef, selected };
}
