export function max<T>(list: T[] | undefined | null, selector: (element: T) => number) {
    if (!list || list.length === 0)
        return 0;
    return list.reduce((prev, current) => Math.max(prev, selector(current)), Number.MIN_SAFE_INTEGER);
}