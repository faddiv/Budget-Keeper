import React from "react";
import { noop } from "../../helpers";
import classNames from "classnames";

interface  AddSharedCostProps { 

 }

export const AddSharedCost: React.FunctionComponent< AddSharedCostProps> = () => {
    return (
        <form onSubmit={noop}>
                <div className="form-group">
                    <div className="input-group">
                        <input
                            name="article"
                            lang="hu"
                            className={classNames("form-control", { "is-invalid": false })}
                            placeholder="Shared item"
                        />
                        <div className="input-group-append">
                            <button type="submit" className="btn btn-primary">Add</button>
                        </div>
                    </div>
                    <div className="invalid-feedback" style={{ display: "none" }}>
                        {"Hiba"}
                    </div>
                </div>
            </form>
    );
};
