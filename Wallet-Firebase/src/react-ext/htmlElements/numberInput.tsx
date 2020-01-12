import React from "react";
import classNames from "classnames";
import { Input } from 'reactstrap';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
    value: number | null;
    onChange: (val: number | null) => void;
}

export const NumberInput: React.SFC<NumberInputProps> = ({ value, onChange, className, ...rest }) => {
    function onChangeInternal(evt: React.SyntheticEvent<HTMLInputElement>) {
        const newVal = evt.currentTarget.value;
        if (newVal === "") {
            onChange(null);
        } else {
            onChange(parseFloat(newVal));
        }
    }
    return (
        <Input type="number" value={value || ""} onChange={onChangeInternal} className={className} {...rest} />
    );
};
