import React, { useCallback } from "react";
import { IDetailElement } from "./reducers";

interface SharedPriceDetailElementProps {
    model: IDetailElement;
    onShareChanged(detailId: number, rawValue: string) : void;
}

export const SharedPriceDetailElement: React.FunctionComponent<SharedPriceDetailElementProps> = ({ model, onShareChanged }) => {

    const id = model.id;
    const changeHandler = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = evt.target.value;
        onShareChanged(id, rawValue);
    }, [id, onShareChanged]);
    return (
        <li className="list-group-item d-flex justify-content-between">
            <div>{model.name}</div><input className="borderless small" type="time" value={model.value} onChange={changeHandler} />
        </li>
    );
};
