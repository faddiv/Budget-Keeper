import { CategoryModel, categoryService } from "../../walletApi";
import AsyncCreatable from "react-select/async-creatable";
import { PropsBase } from "../../react-ext";
import { components, InputProps } from "react-select";
import { useSelectExt } from "./useSelectExt";

interface SelectOption {
  value: CategoryModel;
  label: string;
}

interface CategoryInputProps extends PropsBase {
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

export function CategoryInput({ value, onSelect, className, onError }: CategoryInputProps) {
  const { selectRef, selected, changeHandler, createHandler } = useSelectExt(value, empty, onSelect);

  return (
    <AsyncCreatable
      ref={selectRef}
      loadOptions={filter}
      components={{ Input }}
      formatCreateLabel={(text) => `${text} - Unknown`}
      value={selected}
      onChange={changeHandler}
      onCreateOption={createHandler}
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
