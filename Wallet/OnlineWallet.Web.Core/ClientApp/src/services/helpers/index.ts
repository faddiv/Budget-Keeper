import _ from "./listHelpers";
export * from "./validation";
export * from "./DateTimeFunctions";
export * from "./etc";
export * from "./linkHelpers";
export * from "./toErrorMessage";
export * from "./PropsBase";
export * from "./range";
export * from "./reactHelpers";
export * from "./TransactionViewModel";
export * from "./switchCase";
export * from "./forwardedRefHelpers";
export * from "./useBeforeUnload";
export { _ };

declare module "react-table" {
  export interface UseDeleteTableOptions<D extends object> {
    deleteRow?(items: D): void;
  }

  export interface TableOptions<D extends object> extends UseDeleteTableOptions<D> {}
}
