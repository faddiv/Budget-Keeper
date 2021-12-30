import { StylesConfig } from "react-select";

export const rsBsStyles: StylesConfig<any, boolean, any> = {
  control: (provided, state) => {
    if (state.isFocused) {
      delete provided["&:hover"];
      provided.borderColor = "#86b7fe";
      provided.boxShadow = "0 0 0 0.25rem rgb(13 110 253 / 25%)";
    }
    return provided;
  },
};
