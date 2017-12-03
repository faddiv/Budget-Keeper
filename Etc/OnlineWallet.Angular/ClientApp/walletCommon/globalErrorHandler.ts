import { ErrorHandler } from "@angular/core";

export class GlobalErrorHandler extends ErrorHandler {
    constructor() {
        super();
    }
    handleError(error: Response | any) {
        console.error(error);
    }
}