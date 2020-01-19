import React from "react";
import classNames from "classnames";
import { useSingleValueAdd } from "./reducers";

interface AddSharedCostProps {
    onAddSharedCost(name: string): void;
}

export const AddSharedCost: React.FunctionComponent<AddSharedCostProps> = ({ onAddSharedCost }) => {

    const { state, changeHandler, onSubmit } = useSingleValueAdd(onAddSharedCost);
    const { invalid, showError, value } = state;

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <div className="input-group">
                    <input
                        name="sharedItem"
                        lang="hu"
                        className={classNames("form-control", { "is-invalid": invalid && showError })}
                        placeholder="Shared item"
                        value={value}
                        onChange={changeHandler}
                    />
                    <div className="input-group-append">
                        <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                </div>
                <div className="invalid-feedback" style={{ display: invalid && showError ? "block" : "none" }}>
                    {"Hiba"}
                </div>
            </div>
        </form>
    );
};
