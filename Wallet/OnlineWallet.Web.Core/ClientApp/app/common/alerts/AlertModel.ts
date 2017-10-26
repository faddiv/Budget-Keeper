export class AlertModel {
    constructor(
        public text: string,
        public type: "success" | "info" | "warning" | "danger"
    ) {
    }

    public static error(text: string) {
        return new AlertModel(text, "danger");
    }

    public static success(text: string) {
        return new AlertModel(text, "success");
    }

    public static warning(text: string) {
        return new AlertModel(text, "warning");
    }

    public static info(text: string) {
        return new AlertModel(text, "info");
    }
}
