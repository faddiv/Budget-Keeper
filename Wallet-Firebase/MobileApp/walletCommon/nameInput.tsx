import * as React from "react";
import { Autocomplete, AutocompleteModel } from "react-ext";

interface NameInputProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
}

export const NameInput: React.SFC<NameInputProps> = ({ value, onChange, ...rest }) => {
    function onChangeInternal(evt: React.SyntheticEvent<HTMLInputElement>) {
        onChange(evt.currentTarget.value);
    }
    return (
        <Autocomplete id="article" name="article" placeholder="Article name" onFilter={filter} onError={error} value={value} onChange={onChangeInternal} {...rest}>
            {rest.children}
        </Autocomplete>
    );
};

function filter(value: string) {
    return Promise.resolve<AutocompleteModel[]>([{
        name: value + "asdf",
        nameHighlighted: `<strong>${value}</strong>asdf`
    }]);
}

function error(err: Error) {
    console.error(err);
}
