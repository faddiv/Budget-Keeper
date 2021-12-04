import { CategoryModel, categoryService } from "../../services/walletApi";
import AsyncCreatable from "react-select/async-creatable";
import { PropsBase } from "../../services/helpers";
import Input from "../MiniComponents/InputForSelect";
import { useSelectExt } from "../../services/hooks";
import { rsBsStyles } from "../MiniComponents/reactSelectBootstrapStyles";
import { FocusEventHandler, ForwardedRef, forwardRef, KeyboardEventHandler } from "react";

interface SelectOption {
  value: CategoryModel;
  label: string;
}

interface CategoryInputProps extends PropsBase {
  name?: string;
  value: string;
  autoFocus?: boolean;
  onSelect?: (selected: CategoryModel) => void;
  className?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}
const empty: CategoryModel = {
  name: "",
  nameHighlighted: "",
  occurence: 0,
};

function CategoryInputInt({ value, onSelect, className, onBlur, name = "category", autoFocus, onKeyDown }: CategoryInputProps, ref: ForwardedRef<any>) {
  const { selectRef, selected, changeHandler, createHandler } = useSelectExt(value, empty, onSelect);

  if (typeof ref === "function") {
    ref(selectRef.current);
  }

  return (
    <AsyncCreatable
      ref={selectRef}
      inputId={name}
      loadOptions={filter}
      components={{ Input }}
      formatCreateLabel={(text) => `${text} - Unknown`}
      value={selected}
      onChange={changeHandler}
      onCreateOption={createHandler}
      styles={rsBsStyles}
      className={className}
      classNamePrefix="ci"
      autoFocus={autoFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
}

async function filter(value: string, callback: (options: SelectOption[]) => void) {
  const result = await categoryService.filterBy(value);
  const list = result.map<SelectOption>((value) => ({ value, label: value.name || "" }));
  callback(list);
}

export const CategoryInput = forwardRef(CategoryInputInt);
