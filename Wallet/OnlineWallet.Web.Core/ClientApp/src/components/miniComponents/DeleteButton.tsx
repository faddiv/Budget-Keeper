import { MouseEvent } from "react";
import { Button } from "react-bootstrap";

export interface DeleteButtonProps {
  onClick(evt: MouseEvent<HTMLButtonElement>): void;
}
export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button variant="danger" size="sm" onClick={onClick}>
      <span className="fa fa-trash"></span>
    </Button>
  );
}
