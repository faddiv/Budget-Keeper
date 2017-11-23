export var walletApiConfig = {
    baseUrl: "http://localhost:56491",
    jsonRequestConfig(data: any, method: "PUT" | "POST" | "DELETE", extra?: RequestInit): RequestInit {
        let requestInit: RequestInit = {
            method: method,
            mode: "cors",
            headers: new Headers({
                "Content-Type": "text/json;charset=UTF-8"
            }),
            body: JSON.stringify(data)
        };
        if(extra) {
            requestInit = Object.assign(requestInit, extra);
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