import React from "react";
import classNames from "classnames";
import { noop } from "../../helpers";

interface PersonCostDetailAddProps { }

export const PersonCostDetailAdd: React.FunctionComponent<PersonCostDetailAddProps> = () => {
    return (
        <li className="list-group-item d-flex justify-content-between">
            <form onSubmit={noop} style={{ width: "100%" }}>
                <div className="form-row">
                    <div className="col">
                        <input className="form-control form-control-sm" placeholder="Item" />
                    </div>
                    <div className="col">
                        <div className="input-group">
                            <input
                                name="price-for"
                                lang="hu"
                                className={classNames("form-control form-control-sm", { "is-invalid": false })}
                                placeholder="Price"
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
