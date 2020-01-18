import React from "react";
import { IDetailElement } from "./reducers";
import { noop } from "helpers";

interface SharedPriceDetailElementProps {
    model: IDetailElement;
}

export const SharedPriceDetailElement: React.FunctionComponent<SharedPriceDetailElementProps> = ({ model }) => {
    return (
        <li className="list-group-item d-flex justify-content-between">
            <div>{model.name}</div><input className="borderless small" type="time" value={model.value} onChange={noop} />
        </li>
    );
};
