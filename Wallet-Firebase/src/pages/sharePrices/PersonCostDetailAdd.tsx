import React from "react";
import classNames from "classnames";
import { useTwoValueAdd, ITwoValueAdddHandller } from './reducers';

interface PersonCostDetailAddProps {
    onAddPersonCost: ITwoValueAdddHandller;
}

export const PersonCostDetailAdd: React.FunctionComponent<PersonCostDetailAddProps> = ({ onAddPersonCost }) => {
    const { state, nameChangeHandler, priceChangeHandler, submitHandler } = useTwoValueAdd(onAddPersonCost);
    const { item, price, showError } = state;

    return (
        <li className="list-group-item d-flex justify-content-between">
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
                <div className="form-row">
                    <div className="col">
                        <input className={classNames("form-control form-control-sm", { "is-invalid": item.invalid && showError })}
                            placeholder="Item"
                            list="itemOptions"
                            value={item.value}
                            onChange={nameChangeHandler}
                        />
                        <datalist id="itemOptions">
                            <option>Étel</option>
                            <option>Ital</option>
                        </datalist>
                    </div>
                    <div className="col">
                        <div className="input-group">
                            <input className={classNames("form-control form-control-sm", { "is-invalid": price.invalid && showError })}
                                name="price-for"
                                lang="hu"
                                placeholder="Price"
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
