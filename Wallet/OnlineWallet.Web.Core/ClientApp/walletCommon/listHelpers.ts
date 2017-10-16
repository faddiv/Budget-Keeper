//import "reflect-metadata" //This causes the following error in angular: Unexpected value imported by the module Please add a @NgModule annotation.

export module ListHelpers {
    export function remove<TElement>(list: TElement[], item: TElement): TElement[] {
        return (list || []).filter(e => e !== item);
    }

    export function clear(list: any[]) {
        list.length = 0;
    }

    export function createRange(from: number, to: number) {
        var list = [];
        for (var index = from; index <= to; index++) {
            list.push(index);
        }
        return list;
    }
    
    export function selectMap<T, V>(list: T[] | undefined, where: (val: T) => boolean, select: (val: T) => V) {
        return list && list.filter(where).map(select)[0];
    }
}
