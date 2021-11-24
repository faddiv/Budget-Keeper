import { FunctionComponent } from "react";
import { CommandLine } from "./CommandLine";

interface SaveCancelProps {
  save: React.MouseEventHandler<HTMLButtonElement>;
  cancel: React.MouseEventHandler<HTMLButtonElement>;
}

export const SaveCancel: FunctionComponent<SaveCancelProps> = ({ save, cancel }) => {
  return (
    <CommandLine>
      <button className="btn btn-success btn-sm btn-save" type="button" onClick={save}>
        <span className="fa fa-check"></span>
      </button>
      <button className="btn btn-danger btn-sm btn-cancel" type="button" onClick={cancel}>
        <span className="fa fa-ban"></span>
      </button>
    </CommandLine>
  );
};
