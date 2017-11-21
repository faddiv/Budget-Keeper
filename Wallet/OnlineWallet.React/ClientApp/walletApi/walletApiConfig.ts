export var walletApiConfig = {
    baseUrl: "http://localhost:56491",
    jsonRequestConfig(data: any, method: "PUT" | "POST" | "DELETE"): RequestInit {
        return {
            method: method,
            mode: "cors",
            headers: new Headers({
                "Content-Type": "text/json;charset=UTF-8"
            }),
            body: JSON.stringify(data)
        };
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