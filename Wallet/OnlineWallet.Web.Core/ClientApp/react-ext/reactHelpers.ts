import * as React from "react";

export function updateState<T>(event: React.SyntheticEvent<T>): any {
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

export function isClickableClicked(event: React.MouseEvent<HTMLElement>): boolean {
    let target: HTMLElement = event.target as HTMLElement;
    while (target && target !== event.currentTarget) {
        const targetTag = target.tagName;
        if (targetTag === "INPUT" || targetTag === "SELECT" || targetTag === "BUTTON") {
            return true;
        }
        target = target.parentElement;
    }
    return false;
}

export function preventDefault(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
}
