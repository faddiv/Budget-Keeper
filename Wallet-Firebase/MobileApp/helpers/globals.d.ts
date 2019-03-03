interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

// Omit taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;