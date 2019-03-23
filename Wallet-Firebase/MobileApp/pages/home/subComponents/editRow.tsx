import * as React from "react";
import * as moment from "moment";
import * as classNames from "classnames";
import { ToDoModel } from "walletServices/toDoServices";
import { NumberInput, IconButton, DateInput } from "react-ext";
import { today } from "helpers";
import { NameInput } from "walletCommon";
import { ArticleModel } from "walletServices";

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
    const [shouldCheck, setShouldCheck] = React.useState(item.price !== null);
    function saveToDo(ok: boolean) {
        save({
            id: item.id,
            checkedDate,
            name,
            price,
            ok,
            userId: item.userId
        });
    }
    function saveAndChecInternal(evt: React.MouseEvent) {
        evt.preventDefault();
        saveToDo(true);
    }
    function saveInternal(evt: React.MouseEvent) {
        evt.preventDefault();
        saveToDo(item.ok);
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

    function onSelect(item2: ArticleModel) {
        if (item2 && item2.lastPrice) {
            setPrice(item2.lastPrice);
            setName(item2.name);
        }
    }

    return (
        <form>
            <div className="form-row">
                <div className="col-6">
                    <div className="input-group">
                        <div className="input-group">
                            {item.ok && (
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fa fa-check"></i></span>
                                </div>)}
                            <NameInput value={name}
                                onChange={setName}
                                onSelect={onSelect}
                                className={classNames("form-control")}>
                            </NameInput>
                        </div>
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
                    <IconButton icon="check" size="lg" onClick={saveAndChecInternal} style={{ visibility: shouldCheck ? "visible" : "hidden" }} type="button" title="Done and save" />
                    <IconButton icon="save" size="lg" onClick={saveInternal} type="submit" title="Save changes" />
                    <IconButton icon="times" size="lg" onClick={cancelInternal} title="Cancel changes" />
                </div>
            </div>
        </form>
    );
};
