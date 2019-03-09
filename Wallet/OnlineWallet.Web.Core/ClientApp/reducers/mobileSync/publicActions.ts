import * as firebase from "firebase/app";
import "firebase/firestore";
import { Dispatch } from "redux";
import { MobileSyncInternal } from "./internalActions";
import { articleService } from "walletApi";
import { AlertsActions } from "actions/alerts";

function escapeForFirestore(name: string) {
    return name && name.replace(/[\/\.]/g, "*");
}

export namespace MobileSyncActions {
    export function syncToMobile() {
        return async (dispatch: Dispatch) => {
            dispatch(MobileSyncInternal.setState("downloading"));
            const articles = await articleService.filterBy("", 1000);
            dispatch(MobileSyncInternal.setState("uploading"));
            const db = firebase.firestore();
            let batch = db.batch();
            const articlesTable = db.collection("articles");
            const existing = [...(await articlesTable.get()).docs];
            let added = 0;
            let modified = 0;
            let count = 0;
            for (const article of articles) {
                const id = escapeForFirestore(article.name);
                const index = existing.findIndex(e => e.id !== id);
                added += index === -1 ? 1 : 0;
                modified += index !== -1 ? 1 : 0;
                if (index !== -1) {
                    existing.splice(index, 1);
                }
                const doc = articlesTable.doc(id);
                batch.set(doc, article);
                count++;
                if (count === 500) {
                    await batch.commit();
                    batch = db.batch();
                }
            }
            for (const article of existing) {
                batch.delete(article.ref);
                count++;
                if (count === 500) {
                    await batch.commit();
                    batch = db.batch();
                }
            }
            await batch.commit();
            dispatch(MobileSyncInternal.setState(null));
            dispatch(AlertsActions.showAlert({
                type: "info",
                message: `Sync finished Added: ${added} Modified: ${modified} Deleted: ${existing.length}`
            }));
        };
    }
}
