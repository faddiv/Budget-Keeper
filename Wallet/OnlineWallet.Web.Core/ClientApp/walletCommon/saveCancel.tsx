import * as React from "react";

interface SaveCancelProps {
    save: React.MouseEventHandler<HTMLButtonElement>;
    cancel: React.MouseEventHandler<HTMLButtonElement>;
}

export const SaveCancel: React.SFC<SaveCancelProps> = ({ save, cancel }) => {
    return (
        <div className="cmd-btn-line">
            <button className="btn btn-success btn-sm" type="button" onClick={save}>
                <span className="fa fa-check"></span>
            </button>
            <button className="btn btn-danger btn-sm" type="button" onClick={cancel}>
                <span className="fa fa-ban"></span>
            </button>
        </div>
    );
};
