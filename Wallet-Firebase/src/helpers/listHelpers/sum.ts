export function sum<T>(list: T[] | undefined | null, selector: (element: T) => number) {
    if (!list || list.length === 0)
        return 0;
    return list.reduce((prev, current) => prev + selector(current), 0);
}