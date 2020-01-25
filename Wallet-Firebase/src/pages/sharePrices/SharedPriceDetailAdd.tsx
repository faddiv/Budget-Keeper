import React from "react";
import classNames from "classnames";
import { useTwoValueAdd, ITwoValueAdddHandller } from './reducers';

interface SharedPriceDetailAddProps {
    onAddPersonToSharedPrice: ITwoValueAdddHandller;
}

export const SharedPriceDetailAdd: React.FunctionComponent<SharedPriceDetailAddProps> = ({ onAddPersonToSharedPrice }) => {
    const { state, nameChangeHandler, priceChangeHandler, submitHandler } = useTwoValueAdd(onAddPersonToSharedPrice);
    const { item, price, showError } = state;

    return (
        <li className="list-group-item d-flex justify-content-between">
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
                <div className="form-row">
                    <div className="col">
                        <input className={classNames("form-control form-control-sm", { "is-invalid": item.invalid && showError })}
                            placeholder="Item"
                            value={item.value}
                            onChange={nameChangeHandler}
                        />
                    </div>
                    <div className="col">
                        <div className="input-group">
                            <input className={classNames("form-control form-control-sm", { "is-invalid": price.invalid && showError })}
                                name="time-for"
                                lang="hu"
                                placeholder="Time"
                                value={price.value}
                                onChange={priceChangeHandler}
                            />
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-secondary btn-sm">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </li>
    );
};
