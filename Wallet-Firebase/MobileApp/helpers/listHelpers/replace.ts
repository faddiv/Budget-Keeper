export function replace<TElement>(list: TElement[], newElement: TElement, oldElement: TElement, addIfElementIsNew: boolean = false): TElement[] {
    if (oldElement === newElement) {
        return list;
    }
    const index = list.indexOf(oldElement);
    if (index === -1) {
        if (!addIfElementIsNew) {
            return list;
        }
        return [...list, newElement];
    } else {
        const newList = [...list];
        newList[index] = newElement;
        return newList;
    }
}
