import React, { useCallback } from "react";
import { IDetailElement, IPriceSharingDispatcher } from "./reducers";

interface SharedPriceDetailElementProps {
    model: IDetailElement;
    dispatch: IPriceSharingDispatcher;
}

export const SharedPriceDetailElement: React.FunctionComponent<SharedPriceDetailElementProps> = ({ model, dispatch }) => {

    const id = model.id;
    const changeHandler = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = evt.target.value;
        dispatch.modifyPersonShareById(id, rawValue);
    }, [id, dispatch]);
    return (
        <li className="list-group-item d-flex justify-content-between">
            <div>{model.name}</div><input className="borderless small" type="time" value={model.value} onChange={changeHandler} />
        </li>
    );
};
