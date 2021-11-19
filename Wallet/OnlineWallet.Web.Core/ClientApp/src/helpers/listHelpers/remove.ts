export function remove<TElement>(list: TElement[], item: TElement): TElement[] {
    return (list || []).filter(e => e !== item);
}
