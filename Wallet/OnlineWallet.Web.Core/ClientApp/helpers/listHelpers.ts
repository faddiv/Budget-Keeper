// import "reflect-metadata" 
// This causes the following error in angular: Unexpected value imported by the module Please add a @NgModule annotation.

namespace ListHelpers {
    export function remove<TElement>(list: TElement[], item: TElement): TElement[] {
        return (list || []).filter(e => e !== item);
    }

    export function replace<TElement>(list: TElement[], newElement: TElement, oldElement: TElement, addIfElementIsNew: boolean = false): TElement[] {
        const items: TElement[] = [];
        let added = false;
        for (const element of list) {
            if (element === oldElement) {
                items.push(newElement);
                added = true;
            } else {
                items.push(element);
            }
        }
        if (addIfElementIsNew && !added) {
            items.push(newElement);
        }
        return items;
    }

    export function clear(list: any[]) {
        list.length = 0;
    }

    export function createRange(from: number, to: number) {
        const list = [];
        for (let index = from; index <= to; index++) {
            list.push(index);
        }
        return list;
    }

    export function selectMap<T, V>(list: T[] | undefined, where: (val: T) => boolean, select: (val: T) => V) {
        return list && list.filter(where).map(select)[0];
    }

    export function contains<T>(list: T[], element: T): boolean {
        return list.indexOf(element) > -1;
    }

    export function findLast<TElement>(list: TElement[], predicate: (value: TElement, index: number, list: TElement[]) => boolean, thisArg?: any): TElement {
        if(thisArg !== undefined) {
            predicate = predicate.bind(thisArg);
        }
        if (list.length === 0) {
            return undefined;
        }
        for (let i = list.length - 1; i >= 0; i--) {
            const element = list[i];
            if (predicate(element, i, list))
                return element;
        }
        return undefined;

    }
}

export default ListHelpers;
