
/**
 * Create a promises which resolves after "milliseconds" time elapsed. This is for testing purposes.
 * @param milliseconds how much delay the next statement
 */
export function delay(milliseconds: number): Promise<any> {
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
    return promise;
}

export function formatInt(num: number) {
    return num.toLocaleString("hu");
}

export function today() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}
/**
 * A function that does nothing... For a reason.
 */
export function noop() { }

export function createRenderCounter() {
    let renderCounter = 0;
    return () => ++renderCounter;
}
