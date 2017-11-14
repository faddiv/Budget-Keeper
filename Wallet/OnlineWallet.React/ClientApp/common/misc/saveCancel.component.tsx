import * as React from 'react';

interface SaveCancelProps {
    save,
    cancel
}

const SaveCancel: React.SFC<SaveCancelProps> = ({ save, cancel, ...rest }) => {
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

SaveCancel.defaultProps = {};
export { SaveCancel };