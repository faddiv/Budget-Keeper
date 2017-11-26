import * as React from 'react';

type InputType = "text" | "button" | "submit" | "reset" | "radio" | "checkbox" | "color" |
    "date" | "datetime-local" | "email" | "month" | "number" | "range" | "search" | "tel" |
    "time" | "url" | "week";

interface FormGroupProps {
    id?: string,
    name: string,
    label: string,
    type?: InputType,
    value?: any,
    onChange?: () => void
}

export const FormGroup: React.SFC<FormGroupProps> = ({ id, name, label, type, value, onChange, ...rest }) => {
    id = id || name;
    return (
        <div className="form-group row">
            <label htmlFor={id} className="col-sm-2 col-form-label">{label}</label>
            <div className="col-sm-10">
                {rest.children ? rest.children : <input type={type} className="form-control" id={id} name={name} placeholder={label} value={value} onChange={onChange} />}
            </div>
        </div>
    );
};

FormGroup.defaultProps = {
    type: "text",
    onChange: () => { }
};