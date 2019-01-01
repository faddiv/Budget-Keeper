export function findLast<TElement>(list: TElement[], predicate: (value: TElement, index: number, list: TElement[]) => boolean, thisArg?: any): TElement {
    if (thisArg !== undefined) {
        predicate = predicate.bind(thisArg);
    }
    if (list.length === 0) {
        return undefined;
    }
    for (let i = list.length - 1; i >= 0; i--) {
        const element = list[i];
        if (predicate(element, i, list)) {
            return element;
        }
    }
    return undefined;

}
