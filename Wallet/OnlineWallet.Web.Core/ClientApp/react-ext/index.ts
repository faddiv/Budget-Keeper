import { SyntheticEvent } from "react";

export * from "./reactHelpers";
export * from "./autocomplete";
export * from "./tabpanel";
export * from "./range";
export * from "./switchCase";
export * from "./collapse";

/**
 * Calls preventDefault on the event argument.
 * @param event argument of the eventhandler.
 */
export function noAction(event: SyntheticEvent<any>) {
    event.preventDefault();
}
