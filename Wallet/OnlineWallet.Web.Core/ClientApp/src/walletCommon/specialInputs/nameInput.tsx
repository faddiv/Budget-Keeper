import { FocusEventHandler, ForwardedRef, forwardRef, KeyboardEventHandler, useEffect } from "react";
import { PropsBase } from "../../react-ext";
import { ArticleModel, articleService } from "../../walletApi";
import AsyncCreatable from "react-select/async-creatable";
import { components, InputProps } from "react-select";
import { useSelectExt } from "./useSelectExt";
import { rsBsStyles } from "./reactSelectBootstrapStyles";

interface SelectOption {
  value: ArticleModel;
  label: string;
}

interface NameInputProps extends PropsBase {
  name?: string;
  value: string;
  onError?: (error: Error) => void;
  autoFocus?: boolean;
  onSelect?: (selected: ArticleModel) => void;
  className?: string;
  focusAction?: (focus: () => void) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}
const empty: ArticleModel = {
  name: "",
  category: "",
  lastPrice: undefined,
  lastWallet: undefined,
  nameHighlighted: "",
  occurence: 0,
};

function NameInputInt({ value, autoFocus, onSelect, className, focusAction, name = "name", onBlur, onKeyDown }: NameInputProps, ref: ForwardedRef<any>) {
  const { selectRef, selected, changeHandler, createHandler } = useSelectExt(value, empty, onSelect);

  if(typeof ref === "function") {
    ref(selectRef.current);
  }
  useEffect(() => {
    if (focusAction && selectRef.current) {
      focusAction(() => {
        if (selectRef.current) {
          //selectRef.current.blurInput();
          selectRef.current.focusInput();
        }
      });
    }
  }, [focusAction, selectRef]);

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

function Input(props: InputProps<SelectOption, false>) {
  return <components.Input {...props} data-lpignore={true} />;
}
export const NameInput = forwardRef(NameInputInt);
