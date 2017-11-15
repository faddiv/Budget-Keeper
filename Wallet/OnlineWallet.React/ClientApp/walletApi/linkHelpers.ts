export function buildUrl(url: string, baseUrl: string, query?: any): URL {
    var pathUrl = url;
    var hasParam = false;
    if (query) {
        let searchParams = new URLSearchParams();
        for (var key in query) {
            if (query.hasOwnProperty(key)) {
                var element = query[key];
                if (typeof (element) !== "undefined" && element !== "" && element !== null) {
                    searchParams.append(key, element);
                    hasParam = true;
                }
            }
        }
        if (hasParam) {
            pathUrl = pathUrl + "?" + searchParams.toString();
        }
    }
    var result = new URL(pathUrl, baseUrl);
    return result;
}