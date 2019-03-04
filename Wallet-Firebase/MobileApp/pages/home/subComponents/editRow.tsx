import * as React from "react";
import * as moment from "moment";
import { ToDoModel } from "walletServices/toDoServices";
import { TextInput, NumberInput, IconButton, DateInput } from "react-ext";
import { today } from "helpers";

interface EditRowProps {
    item: ToDoModel;
    index: number;
    save: (item: ToDoModel) => void;
    cancel: () => void;
}

export const EditRow: React.SFC<EditRowProps> = ({ item, save, cancel }) => {
    const [price, setPrice] = React.useState(item.price);
    const [name, setName] = React.useState(item.name || "");
    const [checkedDate, setCheckedDate] = React.useState(item.checkedDate);
    const [shouldCheck, setShouldCheck] = React.useState(item.price !== null);
    function saveAndChecInternal(evt: React.MouseEvent) {
        evt.preventDefault();
        save({
            id: item.id,
            checkedDate,
            name,
            price,
            ok: true,
            userId: item.userId
        });
    }
    function saveInternal(evt: React.MouseEvent) {
        evt.preventDefault();
        save({
            id: item.id,
            checkedDate,
            name,
            price,
            ok: item.ok,
            userId: item.userId
        });
    }
    function onSetPrice(newPrice: number | null) {
        const newCheck = newPrice !== null;
        setShouldCheck(newCheck);
        const now = today();
        if (newCheck && !checkedDate) {
            setCheckedDate(now);
        } else if (!newCheck && !item.ok && moment(checkedDate).isSame(now)) {
            setCheckedDate(null);
        }
        setPrice(newPrice);
    }
    function cancelInternal(evt: React.MouseEvent) {
        evt.preventDefault();
        cancel();
    }
    return (
        <form>
            <div className="form-row">
                <div className="col-6">
                    <div className="input-group">
                        {item.ok && (
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fa fa-check"></i></span>
                            </div>)}
                        <TextInput value={name} onChange={setName} />
                    </div>
                </div>
                <div className="col-6">
                    <NumberInput value={price} onChange={onSetPrice} />
                </div>
            </div>
            <div className="form-row">
                <div className="col-7">
                    <DateInput value={checkedDate} onChange={setCheckedDate} />
                </div>
                <div className="col-5">
                    <IconButton icon="check" size="lg" onClick={saveAndChecInternal} style={{ visibility: shouldCheck ? "visible" : "hidden" }} />
                    <IconButton icon="save" size="lg" onClick={saveInternal} />
                    <IconButton icon="times" size="lg" onClick={cancelInternal} />
                </div>
            </div>
        </form>
    );
};
