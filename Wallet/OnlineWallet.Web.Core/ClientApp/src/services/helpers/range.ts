export function renderRange(from: number, to: number, callback: (index: number) => JSX.Element): JSX.Element[] {
    const list = [];
    for (let i = from; i <= to; i++) {
        list.push(callback(i));
    }
    return list;
}
