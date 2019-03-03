import * as React from "react";
import * as classNames from "classnames";

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
    value: number;
    onChange: (val: number) => void;
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
        <input type="number" value={value} onChange={onChangeInternal} className={classNames("form-control", className)} {...rest} />
    );
};
