import { Observable } from "rxjs/Observable";
import { ApiError } from "./apiError";
import "rxjs/add/operator/catch"
import "rxjs/add/observable/throw"

export function decorateCommonCatch<T>(observable: Observable<T>): Observable<T> {
    return observable.catch((error: Response) => {
        return Observable.throw(new ApiError(error, error.statusText || "Couldn't connect to the server"));
    })
}