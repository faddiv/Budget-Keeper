import * as React from "react";
import { ToDoModel } from "walletServices/toDoServices";
import { TextInput, NumberInput, IconButton, DateInput } from "react-ext";

interface EditRowProps {
    item: ToDoModel;
    index: number;
    save: (item: ToDoModel) => void;
    cancel: () => void;
}

export const EditRow: React.SFC<EditRowProps> = ({ item, save, cancel }) => {
    const [price, setPrice] = React.useState(item.price);
    const [name, setName] = React.useState(item.name);
    const [checkedDate, setCheckedDate] = React.useState(item.checkedDate);
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
                    <NumberInput value={price} onChange={setPrice} />
                </div>
            </div>
            <div className="form-row">
                <div className="col-8">
                    <DateInput value={checkedDate} onChange={setCheckedDate} />
                </div>
                <div className="col-4">
                    <IconButton icon="check" size="lg" onClick={saveInternal} />
                    <IconButton icon="times" size="lg" onClick={cancelInternal} />
                </div>
            </div>
        </form>
    );
};
