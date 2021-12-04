import { MouseEvent, SyntheticEvent } from "react";

export function updateState<T>(event: SyntheticEvent<T>): any {
    const target = event.target as HTMLInputElement;
    let value;
    switch (target.type) {
        case "checkbox":
            value = target.checked;
            break;
        case "file":
            value = target.files;
            break;
        default:
            value = target.value;
            break;
    }
    const name = target.name;
    return {
        [name]: value
    };
}

export function isClickableClicked(event: MouseEvent<HTMLElement>): boolean {
    let target: HTMLElement | null = event.target as HTMLElement;
    while (target && target !== event.currentTarget) {
        const targetTag = target.tagName;
        if (targetTag === "INPUT" || targetTag === "SELECT" || targetTag === "BUTTON") {
            return true;
        }
        target = target.parentElement;
    }
    return false;
}

/**
 * Calls preventDefault on the event argument.
 * @param event argument of the eventhandler.
 */
export function preventDefault(event: SyntheticEvent<HTMLElement>) {
    event.preventDefault();
}
