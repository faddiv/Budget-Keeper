import React, { useCallback } from "react";
import classNames from "classnames";
import { IDetailElement, IPriceSharingDispatcher } from "./reducers";
import { noop } from "helpers";

interface PersonCostDetailElementProps {
    model: IDetailElement;
    dispatch: IPriceSharingDispatcher;
}

export const PersonCostDetailElement: React.FunctionComponent<PersonCostDetailElementProps> = ({ model, dispatch }) => {
    const id = model.id;
    const changeHandler = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = evt.target.value;
        dispatch.modifyPersonCostById(id, rawValue);
    }, [id, dispatch]);
    return (
        <li className={classNames("list-group-item d-flex justify-content-between", { "list-group-item-light": !model.editable })}>
            <div>{model.name}</div>
            {model.editable
                ? <input className="borderless small" type="number" value={model.value} onChange={changeHandler} />
                : <small>{model.value}</small>}
        </li>
    );
};
