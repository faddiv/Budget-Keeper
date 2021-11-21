import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { PropsBase } from "../../react-ext";
import { ArticleModel, articleService } from "../../walletApi";
import AsyncCreatable from "react-select/async-creatable";
import { components, InputProps, OnChangeValue, SelectInstance } from "react-select";

export interface SelectOption {
  value: ArticleModel;
  label: string;
}

interface NameInputProps extends PropsBase {
  value: string;
  onError: (error: Error) => void;
  autoFocus?: boolean;
  onSelect?: (selected: ArticleModel) => void;
  className?: string;
  focusAction?: (focus: () => void) => void;
}
const empty: Omit<ArticleModel, "name"> = {
  category: "",
  lastPrice: undefined,
  lastWallet: undefined,
  nameHighlighted: "",
  occurence: 0,
};

export const NameInput: FunctionComponent<NameInputProps> = ({ value, autoFocus, onSelect, className, focusAction, onError }) => {
  const selectRef = useRef<SelectInstance<SelectOption>>(null);
  const [selected, setSelected] = useState<SelectOption | null>(null);
  const changeHandler = useCallback(
    (newValue: OnChangeValue<SelectOption, false>) => {
      setSelected(newValue);
      if (!newValue) {
        onSelect && onSelect(empty);
        return;
      }
      onSelect && onSelect(newValue.value);
    },
    [onSelect]
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
    [onSelect]
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
  }, [selected, value]);
  useEffect(() => {
    if (focusAction && selectRef.current) {
      focusAction(() => {
        if (selectRef.current) {
          selectRef.current.blurInput();
          selectRef.current.focusInput();
        }
      });
    }
  }, [focusAction]);
  return (
    <AsyncCreatable
      ref={selectRef}
      loadOptions={filter}
      components={{ Input }}
      formatCreateLabel={(text) => `${text} - Unknown`}
      value={selected}
      onChange={changeHandler}
      onCreateOption={createHandler}
      autoFocus={autoFocus}
    />
  );
};

async function filter(value: string, callback: (options: SelectOption[]) => void) {
  const result = await articleService.filterBy(value, 6);
  const list = result.map<SelectOption>((value) => ({ value, label: value.name || "" }));
  callback(list);
}

function Input(props: InputProps<SelectOption, false>) {
  return <components.Input {...props} data-lpignore={true} />;
}
/*
return (
        <Autocomplete name="name" focusAction={focusAction} value={value} onFilter={filter} autoFocus={autoFocus} onChange={onChange} onSelect={onSelect} className={className} onError={onError} data-lpignore={true}>
            {rest.children}
        </Autocomplete>
    );
*/
