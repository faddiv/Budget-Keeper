import { Action } from "redux";
import { MobileSync } from "./actionNames";
import { MobileSyncState } from "./models";

export interface SetStateAction extends Action<typeof MobileSync.SetState> {
    state: MobileSyncState;
}

export namespace MobileSyncInternal {

    export function setState(state: MobileSyncState): SetStateAction {
        return {
            type: MobileSync.SetState,
            state
        };
    }
}
