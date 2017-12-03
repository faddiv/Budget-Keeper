export var walletApiConfig = {
    baseUrl: PRODUCTION ? "http://wallet.localtest.me" : "http://localhost:56491",
    jsonRequestConfig(data: any, method: "PUT" | "POST" | "DELETE", extra?: RequestInit): RequestInit {
        let requestInit: RequestInit = {
            method: method,
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8"
            }),
            body: JSON.stringify(data)
        };
        if(extra) {
            requestInit = Object.assign(requestInit, extra);
        }
        if (!PRODUCTION) {
            requestInit.mode = "cors";
        }
        return requestInit;
    }
}

export function ThenJsonGenerator<T>(): (response: Response) => Promise<T> {
    return response => {
        if (response.ok) {
            return <Promise<T>>response.json();
        } else {
            throw Error(response.statusText);
        }
    };
}

export function ThenJson<T>(response: Response) {
    if (response.ok) {
        return <Promise<T>>response.json();
    } else {
        throw Error(response.statusText);
    }
}
