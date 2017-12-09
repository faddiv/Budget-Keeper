export function renderRange(from, to, callback: (index) => JSX.Element): JSX.Element[] {
    const list = [];
    for (let i = from; i <= to; i++) {
        list.push(callback(i));
    }
    return list;
}
