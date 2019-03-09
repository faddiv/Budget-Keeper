export type MobileSyncState = "downloading" | "uploading" | null;

export interface MobileSyncModel {
    state: MobileSyncState;
}
