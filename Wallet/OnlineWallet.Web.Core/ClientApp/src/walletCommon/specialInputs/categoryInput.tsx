import { CategoryModel, categoryService } from "../../walletApi";
import AsyncCreatable from "react-select/async-creatable";
import { PropsBase } from "../../react-ext";
import { components, InputProps } from "react-select";
import { useSelectExt } from "./useSelectExt";
import { rsBsStyles } from "./reactSelectBootstrapStyles";

interface SelectOption {
  value: CategoryModel;
  label: string;
}

interface CategoryInputProps extends PropsBase {
  name?: string;
  value: string;
  onError: (error: Error) => void;
  onSelect?: (selected: CategoryModel) => void;
  className?: string;
}
const empty: CategoryModel = {
  name: "",
  nameHighlighted: "",
  occurence: 0,
};

export function CategoryInput({ value, onSelect, className, onError, name = "category" }: CategoryInputProps) {
  const { selectRef, selected, changeHandler, createHandler } = useSelectExt(value, empty, onSelect);

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
    />
  );
}

async function filter(value: string, callback: (options: SelectOption[]) => void) {
  const result = await categoryService.filterBy(value);
  const list = result.map<SelectOption>((value) => ({ value, label: value.name || "" }));
  callback(list);
}

function Input(props: InputProps<SelectOption, false>) {
  return <components.Input {...props} data-lpignore={true} />;
}
