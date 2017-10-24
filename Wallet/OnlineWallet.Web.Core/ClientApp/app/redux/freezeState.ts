import { MiddlewareAPI, Dispatch } from "redux";

function deepFreeze<T>(o: T): T {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach((prop) => {
    if (o.hasOwnProperty(prop)
    && o[prop] !== null
    && (typeof o[prop] === "object" || typeof o[prop] === "function")
    && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });

  return o;
};

export function freezeState<S>(api: MiddlewareAPI<S>): (next: Dispatch<S>) => Dispatch<S> {
  return (next) => (action) => {
    const result = next(action);
    const state = api.getState();
    deepFreeze(state);
    return result;
  }
}