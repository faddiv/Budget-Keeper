//TODO: Replace with method decorator: https://github.com/NoHomey/bind-decorator/blob/master/src/index.ts
export function bindFunctions<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        constructor (...args:any[]) {
            super(...args);
            var prototype = Object.getPrototypeOf(Object.getPrototypeOf(this));
            for (var key in prototype) {
                if (prototype.hasOwnProperty(key)) {
                    var func = prototype[key];
                    if(typeof(func) === "function") {
                        this[key] = func.bind(this);
                    }
                }
            }
        }
    }
}