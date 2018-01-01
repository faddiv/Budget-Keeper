/**
 * Contains the url and base request generator for server request.
 */
export const walletApiConfig = {
    /**
     * url of the server.
     */
    baseUrl: PRODUCTION ? "http://wallet.localtest.me" : "http://localhost:56491",

    /**
     * Create a Request config for fetch, when the request body is json data.
     * @param data 
     * @param method 
     * @param extra 
     */
    jsonRequestConfig(data: any, method: "PUT" | "POST" | "DELETE", extra?: RequestInit): RequestInit {
        let requestInit: RequestInit = {
            method,
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8"
            }),
            body: JSON.stringify(data)
        };
        if (extra) {
            requestInit = {...requestInit, ...extra};
        }
        if (!PRODUCTION) {
            requestInit.mode = "cors";
        }
        return requestInit;
    }
};

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
