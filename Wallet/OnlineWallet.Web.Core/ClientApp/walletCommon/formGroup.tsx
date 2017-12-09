import * as React from 'react';
import { ValidationStateElement } from 'helpers';
import { className } from 'react-ext';

type InputType = "text" | "button" | "submit" | "reset" | "radio" | "checkbox" | "color" |
    "date" | "datetime-local" | "email" | "month" | "number" | "range" | "search" | "tel" |
    "time" | "url" | "week";

interface FormGroupProps {
    id?: string,
    name: string,
    label: string,
    type?: InputType,
    value?: any,
    onChange?: () => void,
    autoComplete?: boolean
    validation?: ValidationStateElement
}

export const FormGroup: React.SFC<FormGroupProps> = ({ id, name, label, type, value, onChange, autoComplete, validation, ...rest }) => {
    id = id || name;
    return (
        <div className="form-group row">
            <label htmlFor={id} className="col-sm-2 col-form-label">{label}</label>
            <div className="col-sm-10">
                {rest.children ? rest.children : defaultInput(type, id, name, label, value, onChange, autoComplete, validation)}
            </div>
        </div>
    );
};

function defaultInput(type: string, id: string, name: string, label: string, value: any, onChange: () => void, autoComplete: boolean, validation: ValidationStateElement): React.ReactElement<any>[] {
    let elements: React.ReactElement<any>[] = [
        <input key={1} type={type} className={className("form-control", validation && validation.showError, "is-invalid")}
            id={id} name={name} placeholder={label} value={value} onChange={onChange} autoComplete={autoComplete ? null : "off"} />
    ];
    if (validation) {
        elements.push(
            <div key={2} className="invalid-feedback">
                {validation.message}
            </div>
        );
    }
    return elements;
}

FormGroup.defaultProps = {
    type: "text",
    onChange: () => { },
    autoComplete: false
};