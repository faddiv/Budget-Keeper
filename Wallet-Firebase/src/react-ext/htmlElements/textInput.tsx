import React from "react";
import classNames from "classnames";
import { Input } from 'reactstrap';

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
    value: string;
    onChange: (val: string) => void;
}

export const TextInput: React.SFC<TextInputProps> = ({ value, onChange, className, ...rest }) => {
    function onChangeInternal(evt: React.SyntheticEvent<HTMLInputElement>) {
        onChange(evt.currentTarget.value);
    }
    return (
        <Input type="text" value={value || ""} onChange={onChangeInternal} className={className} {...rest} />
    );
};
