import * as React from "react";
import * as classNames from "classnames";
import * as moment from "moment";

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
    value: Date;
    onChange: (val: Date) => void;
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
        <input type="date" value={dateValue || ""} onChange={onChangeInternal} className={classNames("form-control", className)} {...rest} />
    );
};