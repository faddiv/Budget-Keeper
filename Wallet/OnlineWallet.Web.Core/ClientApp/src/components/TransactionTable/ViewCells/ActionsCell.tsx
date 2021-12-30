import { useCallback } from "react";
import { DeleteButton } from "../../MiniComponents/DeleteButton";
import { CellProps } from "react-table";

export function ActionsCell<D extends object, V = any>({ deleteRow, row: { original }, editEnabled }: CellProps<D, V>) {
  const onClickHandler = useCallback(() => {
    deleteRow?.(original);
  }, [original, deleteRow]);
  return editEnabled ? <DeleteButton onClick={onClickHandler} /> : null;
}
