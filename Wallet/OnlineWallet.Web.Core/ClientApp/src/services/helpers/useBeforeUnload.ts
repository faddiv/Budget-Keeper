import { useEffect } from "react";

export function useBeforeUnload(callback: (event: BeforeUnloadEvent) => string | undefined) {
  useEffect(() => {
    window.addEventListener("beforeunload", callback);
    return () => window.removeEventListener("beforeunload", callback);
  }, [callback]);
}
