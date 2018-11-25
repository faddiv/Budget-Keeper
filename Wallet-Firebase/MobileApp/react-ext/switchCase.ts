
export function switchCase(swKey: string, cases: { [key: string]: (key: string) => any }, defCallback?: (key: string) => any) {

    if ((cases as Object).hasOwnProperty(swKey)) {
        return cases[swKey](swKey);
    }
    if (defCallback) {
        return defCallback(swKey);
    }
}
