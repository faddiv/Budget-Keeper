export function selectMap<T, V>(list: T[] | undefined, where: (val: T) => boolean, select: (val: T) => V) {
    return list && list.filter(where).map(select)[0];
}
