import { ForwardedRef } from "react";

export function setForwardedRef<T = any>(ref: ForwardedRef<T>, instance: T | null) {
  if (ref === null) {
    return;
  }
  if (typeof ref === "function") {
    ref(instance);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(ref, "current")) {
    ref.current = instance;
  }
}

export function combineForwardedRefs<T = any>(ref1: ForwardedRef<T>, ...rest: ForwardedRef<any>[]) {
  return (instance: T | null) => {
    setForwardedRef(ref1, instance);
    for (const moreRef of rest) {
      setForwardedRef(moreRef, instance);
    }
  };
}
