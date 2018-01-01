export function buildUrl(url: string, baseUrl: string, query?: any): URL {
    let pathUrl = url;
    let hasParam = false;
    if (query) {
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
            pathUrl = `${pathUrl}?${searchParams.toString()}`;
        }
    }
    const result = new URL(pathUrl, baseUrl);
    return result;
}
