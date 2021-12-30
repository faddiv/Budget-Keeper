import { FocusEventHandler, ForwardedRef, forwardRef, KeyboardEventHandler } from "react";
import { PropsBase } from "../../services/helpers";
import { ArticleModel, articleService } from "../../services/walletApi";
import AsyncCreatable from "react-select/async-creatable";
import Input from "../MiniComponents/InputForSelect";
import { useSelectExt } from "../../services/hooks";
import { rsBsStyles } from "../MiniComponents/reactSelectBootstrapStyles";
import { ChangeHandler } from "react-hook-form";

interface SelectOption {
  value: ArticleModel;
  label: string;
}

interface NameInputProps extends PropsBase {
  name?: string;
  value?: string | undefined;
  autoFocus?: boolean;
  onSelect?: (selected: ArticleModel) => void;
  className?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onChange?: ChangeHandler;
}
const empty: ArticleModel = {
  name: "",
  category: "",
  lastPrice: undefined,
  lastWallet: undefined,
  nameHighlighted: "",
  occurence: 0,
};

function NameInputInt({ value, autoFocus, onSelect, className, name = "name", onBlur, onKeyDown, onChange }: NameInputProps, ref: ForwardedRef<any>) {
  const { selectRef, selected, changeHandler, createHandler } = useSelectExt(value, empty, ref, onSelect, onChange, name);

  return (
    <AsyncCreatable
      inputId={name}
      ref={selectRef}
      loadOptions={filter}
      components={{ Input }}
      formatCreateLabel={(text) => `${text} - Unknown`}
      value={selected}
      onChange={changeHandler}
      onCreateOption={createHandler}
      autoFocus={autoFocus}
      styles={rsBsStyles}
      onBlur={onBlur}
      className={className}
      onKeyDown={onKeyDown}
      classNamePrefix="ni"
    />
  );
}

async function filter(value: string, callback: (options: SelectOption[]) => void) {
  const result = await articleService.filterBy(value, 6);
  const list = result.map<SelectOption>((value) => ({ value, label: value.name || "" }));
  callback(list);
}

export const NameInput = forwardRef(NameInputInt);
