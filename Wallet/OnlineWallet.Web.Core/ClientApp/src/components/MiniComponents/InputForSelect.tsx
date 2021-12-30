import { components, InputProps } from "react-select";

export default function Input(props: InputProps<any, false>) {
  return <components.Input {...props} data-lpignore={true} />;
}
