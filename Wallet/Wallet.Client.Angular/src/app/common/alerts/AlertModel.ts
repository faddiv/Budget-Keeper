export class AlertModel {
    constructor(
        public text: string,
        public cssClass: string
    ) {
    }

    public static error(text: string) {
        return new AlertModel(text, "alert-danger");
    }
    
    public static success(text: string) {
        return new AlertModel(text, "alert-success");
    }

    public static warning(text: string) {
        return new AlertModel(text, "alert-warning");
    }
    
    public static info(text: string) {
        return new AlertModel(text, "alert-info");
    }
}