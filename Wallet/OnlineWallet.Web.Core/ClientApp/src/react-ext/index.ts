import { SyntheticEvent } from "react";

export * from "./reactHelpers";
export * from "./range";
export * from "./switchCase";
export * from "./PropsBase";

/**
 * Calls preventDefault on the event argument.
 * @param event argument of the eventhandler.
 */
export function noAction(event: SyntheticEvent<any>) {
    event.preventDefault();
}
