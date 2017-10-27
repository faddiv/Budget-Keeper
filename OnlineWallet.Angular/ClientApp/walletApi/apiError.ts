export class ApiError {
    hasError: true;

    constructor(
        public response: Response,
        public message: string) {
    }
}
