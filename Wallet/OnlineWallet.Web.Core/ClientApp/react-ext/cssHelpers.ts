export function className(...values: (string | boolean)[]): string {
    let show = true;
    let cssList: string[] = [];
    for (var value of values) {
        if (typeof (value) !== "string") {
            show = !!value;
            continue;
        }
        if (!show) {
            continue;
        }
        cssList.push(value);
    }
    if (cssList.length) {
        return cssList.join(" ");
    }
}