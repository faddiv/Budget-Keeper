export function replaceByIndex<TElement>(list: TElement[], newElement: TElement, index: number): TElement[] {
    if (list[index] === newElement) {
        return list;
    }

    const newList = [...list];
    newList[index] = newElement;
    return newList;
}
