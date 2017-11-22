import * as React from "react";

export function updateState<T>(event: React.SyntheticEvent<T>): any {
    const target = <HTMLInputElement>event.target;
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
    }
}