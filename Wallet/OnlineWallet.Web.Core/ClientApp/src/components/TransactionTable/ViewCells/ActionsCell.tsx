import { useCallback } from "react";
import { Button } from "react-bootstrap";
import { CellProps } from "react-table";

export function ActionsCell<D extends object, V = any>({ transactionDelete, row: { original } }: CellProps<D, V>) {
  const onClickHandler = useCallback(() => {
    transactionDelete?.(original);
  }, [original, transactionDelete]);
  return (
    <Button variant="danger" size="sm" onClick={onClickHandler}>
      <span className="fa fa-trash"></span>
    </Button>
  );
}
