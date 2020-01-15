import React from "react";
import classNames from "classnames";
import { noop } from "../../helpers";

interface AddPersonProps {

}

export const AddPerson: React.FunctionComponent<AddPersonProps> = () => {
    return (
        <form onSubmit={noop}>
            <div className="form-group">
                <div className="input-group">
                    <input
                        name="person"
                        lang="hu"
                        className={classNames("form-control", { "is-invalid": false })}
                        placeholder="Person"
                        list="persons"
                    />
                    <datalist id="persons">
                        <option value="Viktor" />
                        <option value="Bea" />
                        <option value="Joe" />
                    </datalist>
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
