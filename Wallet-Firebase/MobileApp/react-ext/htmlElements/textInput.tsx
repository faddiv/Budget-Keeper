import * as React from "react";
import * as classNames from "classnames";

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
    value: string;
    onChange: (val: string) => void;
}

export const TextInput: React.SFC<TextInputProps> = ({ value, onChange, className, ...rest }) => {
    function onChangeInternal(evt: React.SyntheticEvent<HTMLInputElement>) {
        onChange(evt.currentTarget.value);
    }
    return (
        <input type="text" value={value || ""} onChange={onChangeInternal} className={classNames("form-control", className)} {...rest} />
    );
};
