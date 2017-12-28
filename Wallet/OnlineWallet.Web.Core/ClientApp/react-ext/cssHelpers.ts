export function className(...values: Array<string | boolean>): string {
    let show = true;
    const cssList: string[] = [];
    for (const value of values) {
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
