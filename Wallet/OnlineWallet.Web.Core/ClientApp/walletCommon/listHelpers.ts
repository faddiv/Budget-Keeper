//import "reflect-metadata" 
//This causes the following error in angular: Unexpected value imported by the module Please add a @NgModule annotation.

module ListHelpers {
    export function remove<TElement>(list: TElement[], item: TElement): TElement[] {
        return (list || []).filter(e => e !== item);
    }

    export function replace<TElement>(list: TElement[], newElement: TElement, oldElement: TElement, addIfElementIsNew: boolean = false): TElement[] {
        const items: TElement[] = [];
        let added = false;
        for (var index = 0; index < list.length; index++) {
            var element = list[index];
            if(element === oldElement) {
                items.push(newElement);
                added = true;
            } else {
                items.push(element);
            }
        }
        if(addIfElementIsNew && !added) {
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
}


export default ListHelpers;