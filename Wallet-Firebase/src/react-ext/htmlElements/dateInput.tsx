import React from "react";
import moment from "moment";
import { Input } from 'reactstrap';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
    value: Date | null;
    onChange: (val: Date | null) => void;
}

export const DateInput: React.SFC<DateInputProps> = ({ value, onChange, className, ...rest }) => {
    const dateValue = value ? moment(value).format("YYYY-MM-DD") : "";
    function onChangeInternal(evt: React.SyntheticEvent<HTMLInputElement>) {
        const newVal = evt.currentTarget.value;
        if (newVal === "") {
            onChange(null);
        } else {
            onChange(moment(newVal).toDate());
        }
    }
    return (
        <Input type="date" value={dateValue || ""} onChange={onChangeInternal} className={className} {...rest} />
    );
};
