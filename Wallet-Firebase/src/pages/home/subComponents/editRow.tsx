import React from "react";
import moment from "moment";
import classNames from "classnames";
import { ToDoModel } from "../../../walletServices/toDoServices";
import { NumberInput, IconButton, DateInput, TextInput } from "../../../react-ext";
import { today } from "../../../helpers";
import { NameInput } from "../../../walletCommon";
import { ArticleModel } from "../../../walletServices";
import { Form, Row, Col, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        saveToDo(!!item.ok);
    }
    function onSetPrice(newPrice: number | null) {
        const newCheck = newPrice !== null;
        setShouldCheck(newCheck);
        const now = today();
        if (newCheck && !checkedDate) {
            setCheckedDate(now);
        } else if (!newCheck && !item.ok && (!checkedDate || moment(checkedDate).isSame(now))) {
            setCheckedDate(null);
        }
        setPrice(newPrice);
    }

    function cancelInternal(evt: React.MouseEvent) {
        evt.preventDefault();
        cancel();
    }

    return (
        <Form>
            <Row form>
                <Col xs={6}>
                    <InputGroup>
                        {item.ok && (
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><FontAwesomeIcon icon="check" /></InputGroupText>
                            </InputGroupAddon>)}
                        <TextInput value={name}
                            onChange={setName}>
                        </TextInput>
                    </InputGroup>
                </Col>
                <Col xs={6}>
                    <NumberInput value={price} onChange={onSetPrice} />
                </Col>
            </Row>
            <Row form>
                <Col>
                    <DateInput value={checkedDate} onChange={setCheckedDate} />
                </Col>
                <Col xs="auto">
                    <IconButton icon="check" size="lg" onClick={saveAndChecInternal} style={{ visibility: shouldCheck ? "visible" : "hidden" }} type="button" title="Done and save" />
                    <IconButton icon="save" size="lg" onClick={saveInternal} type="submit" title="Save changes" />
                    <IconButton icon="times" size="lg" onClick={cancelInternal} title="Cancel changes" />
                </Col>
            </Row>
        </Form>
    );
};
