import * as React from "react";
import * as moment from "moment";
import { ToDoModel } from "walletServices/toDoServices";
import { IconButton } from "react-ext";

interface ViewRowProps {
    item: ToDoModel;
    index: number;
    remove: (item: ToDoModel) => void;
    edit: (index: number) => void;
}

export const ViewRow: React.SFC<ViewRowProps> = ({ item, remove, edit, index }) => {
    const { ok, checkedDate, price, name } = item;
    function removeInternal(evt: React.MouseEvent) {
        evt.preventDefault();
        remove(item);
    }
    function editInternal(evt: React.MouseEvent) {
        evt.preventDefault();
        edit(index);
    }
    return (
        <>
            <div className="form-row">
                <div className="col-6"><span className="fa fa-check" style={{ visibility: ok ? "visible" : "hidden" }}></span>&nbsp;{name}</div>
                <div className="col-6">{price || ""}</div>
            </div>
            <div className="form-row">
                <div className="col-8">{checkedDate && moment(checkedDate).format("L")}</div>
                <div className="col-4">
                    <IconButton icon="edit" size="lg" onClick={editInternal} />
                    <IconButton icon="trash" size="lg" onClick={removeInternal} />
                </div>
            </div>
        </>
    );
};
