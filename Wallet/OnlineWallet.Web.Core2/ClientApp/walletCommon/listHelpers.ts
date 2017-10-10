//import "reflect-metadata" //This causes the following error in angular: Unexpected value imported by the module Please add a @NgModule annotation.

export module ListHelpers {
    export function remove<T>(list: T[], item: T): number {
        var index = list.indexOf(item);
        if (index > -1) {
            list.splice(index, 1);
        }
        return index;
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
    
    export function indexById<T>(list: T[], key: T): number {
        if (!list || !list.length) return -1;
        return list.indexOf(key);
    }

    export function selectMap<T, V>(list: T[], where: (val: T) => boolean, select: (val: T) => V) {
        return list && list.filter(where).map(select)[0];
    }
}