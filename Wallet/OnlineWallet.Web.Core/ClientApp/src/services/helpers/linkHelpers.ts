export function buildUrl(urlSegments: string[], query?: any): string {
    const url: string[] = [];
    for (let index = 0; index < urlSegments.length; index++) {
        const segment = urlSegments[index];
        if (index > 0 || (!segment.startsWith("http://") && !segment.startsWith("https://"))) {
            if (!segment.startsWith("/")) {
                url.push("/");
            }
        }
        if (segment.endsWith("/")) {
            url.push(segment.slice(0, -1));
        } else {
            url.push(segment);
        }
    }
    if (query) {
        let hasParam = false;
        const searchParams = new URLSearchParams();
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                const element = query[key];
                if (typeof (element) !== "undefined" && element !== "" && element !== null) {
                    searchParams.append(key, element);
                    hasParam = true;
                }
            }
        }
        if (hasParam) {
            url.push("?");
            url.push(searchParams.toString());
        }
    }
    return url.join("");
}

/**
 * Create a Request config for fetch, when the request body is json data.
 * @param data 
 * @param method 
 * @param extra 
 */
export function jsonRequestInit(data: any, method: "PUT" | "POST" | "DELETE", extra?: RequestInit): RequestInit {
    let requestInit: RequestInit = {
        method,
        headers: new Headers({
            "Content-Type": "application/json;charset=UTF-8"
        }),
        body: JSON.stringify(data)
    };
    if (extra) {
        requestInit = { ...requestInit, ...extra };
    }
    return requestInit;
}

/**
 * This method contains the json convert and also the error handling.
 * @param response The json converted T model.
 */
export function ThenJson<T>(response: Response) {
    if (response.ok) {
        return response.json() as Promise<T>;
    } else {
        throw Error(response.statusText);
    }
}
