import { FunctionComponent } from "react";
import { CommandLine } from "./CommandLine";

interface EditDeleteProps {
  edit: () => void;
  delete_: () => void;
}

export const EditDelete: FunctionComponent<EditDeleteProps> = ({ edit, delete_ }) => {
  return (
    <CommandLine>
      <button className="btn btn-primary btn-sm btn-edit" type="button" onClick={edit}>
        <span className="fa fa-pencil"></span>
      </button>
      <button className="btn btn-danger btn-sm btn-delete" type="button" onClick={delete_}>
        <span className="fa fa-trash"></span>
      </button>
    </CommandLine>
  );
};
