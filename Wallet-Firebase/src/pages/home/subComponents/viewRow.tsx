import React from "react";
import moment from "moment";
import { ToDoModel } from "../../../walletServices/toDoServices";
import { IconButton } from "../../../react-ext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col } from 'reactstrap';

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
            <Row>
                <Col xs={6}>
                    <FontAwesomeIcon icon="check" style={{ visibility: ok ? "visible" : "hidden" }}></FontAwesomeIcon>&nbsp;{name}
                </Col>
                <Col xs={6}>
                    {price || ""}
                </Col>
            </Row>
            <Row>
                <Col>
                    {checkedDate && moment(checkedDate).format("L")}
                </Col>
                <Col xs="auto">
                    <IconButton icon="edit" size="lg" onClick={editInternal} title="Edit" />
                    <IconButton icon="trash" size="lg" onClick={removeInternal} title="Delete" />
                </Col>
            </Row>
        </>
    );
};
