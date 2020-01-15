import React from "react";
import classNames from "classnames";
import { IDetailElement } from 'walletServices/priceShareServices';
import { noop } from "helpers";

interface PersonCostDetailElementProps {
    model: IDetailElement;
}

export const PersonCostDetailElement: React.FunctionComponent<PersonCostDetailElementProps> = ({ model }) => {
    return (
        <li className={classNames("list-group-item d-flex justify-content-between", { "list-group-item-light": !model.editable })}>
            <div>{model.name}</div>
            {model.editable
                ? <input className="borderless small" type="number" value={model.value} onChange={noop} />
                : <small>{model.value}</small>}
        </li>
    );
};
