export function removeByIndex<TElement>(list: TElement[], index: number): TElement[] {
    const newList = [...list];
    newList.splice(index, 1);
    return newList;
}
