import * as React from "react";

export function updateState<T>(event: React.SyntheticEvent<T>): any {
    const target = <HTMLInputElement>event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    return {
        [name]: value
    }
}