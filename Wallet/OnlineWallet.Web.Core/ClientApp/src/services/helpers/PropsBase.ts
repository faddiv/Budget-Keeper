import { ReactNode } from "react";

export interface PropsBase {
  children?: ReactNode | undefined;
}

export interface SelectOption {
  value: string;
  label: string;
}
