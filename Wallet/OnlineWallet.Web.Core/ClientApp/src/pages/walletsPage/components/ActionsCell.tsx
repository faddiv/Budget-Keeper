import { useCallback } from "react";
import { DeleteButton } from "../../../components/MiniComponents/DeleteButton";
import { CellProps } from "react-table";

export function ActionsCell<D extends object, V = any>({ deleteRow, row: { original } }: CellProps<D, V>) {
  const onClickHandler = useCallback(() => {
    deleteRow?.(original);
  }, [original, deleteRow]);
  return <DeleteButton onClick={onClickHandler} />;
}
