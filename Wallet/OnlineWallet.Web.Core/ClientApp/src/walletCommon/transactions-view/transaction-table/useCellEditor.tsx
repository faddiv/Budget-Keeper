import React, { useCallback } from "react";
import { ActionType, Cell, Hooks, MetaBase, Row, TableCellProps, TableInstance, TableState } from "react-table";

const startEdit = "useCellEditor.startEdit";
const endEdit = "useCellEditor.endEdit";

function prepareRow<D extends object = {}>(row: Row<D>, meta: MetaBase<D>) {
  const editedCell = meta.instance.state.editedCell || { rowId: "", columnId: "" };
  const rowEdited = (meta.instance.editEnabled || false) && editedCell.rowId !== row.id;
  const columnId = editedCell.columnId;
  for (let index = 0; index < row.cells.length; index++) {
    const cell = row.cells[index];
    cell.isEdited = rowEdited && cell.column.id === columnId;
  }
}

function getCellProps<D extends object = {}>(props: Partial<TableCellProps>, meta: MetaBase<D> & { cell: Cell<D> }) {
  if (!meta.instance.editEnabled) {
    return props;
  }
  const rowId = meta.cell.row.id;
  const columnId = meta.cell.column.id;
  return [
    props,
    {
      onDoubleClick: (event) => {
        event.preventDefault();
        meta.instance.dispatch({ type: startEdit, rowId, columnId });
        console.log("Clicked:", meta.cell);
        alert("Clicked");
      },
    } as React.HTMLAttributes<HTMLTableCellElement>,
  ];
}

function reducer<D extends object = {}>(newState: TableState<D>, action: ActionType) {
  if (action.type === startEdit) {
    newState.editedCell = { rowId: action.rowId, columnId: action.columnId };
  }
  if (action.type === endEdit) {
    newState.editedCell = undefined;
  }
  return newState;
}

function useInstance<D extends object = {}>(instance: TableInstance<D>) {
  instance.endEdit = useCallback(() => instance.dispatch({ type: endEdit }), [instance]);
}

export function useCellEditor<D extends object = {}>(hooks: Hooks<D>) {
  hooks.getCellProps.push(getCellProps);
  hooks.stateReducers.push(reducer);
  hooks.prepareRow.push(prepareRow);
  hooks.useInstance.push(useInstance);
}

declare module "react-table" {
  export interface UseCellEditorOptions {
    editEnabled?: boolean;
  }
  export interface UseCellEditorInstanceProps extends UseCellEditorOptions {
    endEdit(): void;
  }
  export interface UseCellEditorState<D extends object> {
    editedCell: { rowId: string; columnId: IdType<D> } | undefined;
  }

  export interface CellEditable<D extends object = {}, V = any> {
    Editor?: Renderer<CellProps<D, V>>;
  }

  export interface UseCellEditorCellProps {
    isEdited: boolean;
  }

  export interface TableOptions<D extends object> extends UseCellEditorOptions {}
  export interface TableInstance<D extends object> extends UseCellEditorInstanceProps {}
  export interface ColumnInterface<D extends object = {}, V = any> extends CellEditable<D, V> {}
  export interface TableState<D extends object = {}> extends UseCellEditorState<D> {}
  export interface Cell<D extends object = {}, V = any> extends UseCellEditorCellProps {}
}
