
/**
 * Create a promises which resolves after "milliseconds" time elapsed. This is for testing purposes.
 * @param milliseconds how much delay the next statement
 */
export function delay(milliseconds: number): Promise<any> {
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve(undefined);
        }, milliseconds);
    });
    return promise;
}

export function formatInt(num: number|undefined) {
    return num ? num.toLocaleString("hu") : "--";
}

/**
 * A function that does nothing... For a reason.
 */
export function noop() { }
