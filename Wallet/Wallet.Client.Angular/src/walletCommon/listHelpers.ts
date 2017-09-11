//import "reflect-metadata" //This causes the following error in angular: Unexpected value imported by the module Please add a @NgModule annotation.

const ItemIdMetedataKey = Symbol("ItemId");

export module ListHelpers {
    export function remove<T>(list: T[], item: T): number {
        var index = list.indexOf(item);
        if (index > -1) {
            list.splice(index, 1);
        }
        return index;
    }
    export function indexById<T>(list: T[], key: T): number {
        if (!list || !list.length) return -1;
        var idProperty = getKey(list[0]);
        if (!idProperty) {
            return list.indexOf(key);
        } else {
            return list.findIndex(item => item[idProperty] === key[idProperty]);
        }
    }
    function getKey(target: any): string {
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                if (isItemId(target, key)) {
                    return key;
                }
            }
        }
    }
}

export function ItemId(): (target: Object, propertyKey: string | symbol) => void {
    return window["Reflect"].metadata(ItemIdMetedataKey, true);
}

function isItemId(target: any, propertyKey: string) {
    return window["Reflect"].getMetadata(ItemIdMetedataKey, target, propertyKey);
}