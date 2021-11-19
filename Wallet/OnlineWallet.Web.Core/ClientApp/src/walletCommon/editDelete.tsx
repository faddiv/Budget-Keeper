import * as React from "react";

interface EditDeleteProps {
    edit: () => void;
    delete_: () => void;
}

export const EditDelete: React.SFC<EditDeleteProps> = ({ edit, delete_ }) => {
    return (
        <div className="cmd-btn-line">
            <button className="btn btn-primary btn-sm btn-edit" type="button" onClick={edit}>
                <span className="fa fa-pencil"></span>
            </button>
            <button className="btn btn-danger btn-sm btn-delete" type="button" onClick={delete_}>
                <span className="fa fa-trash"></span>
            </button>
        </div>
    );
};
