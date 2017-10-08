import { Injectable } from "@angular/core";
import { AlertModel } from "./AlertModel";
import { ListHelpers } from "walletCommon";

export interface IAlertObserver {
    (command: "add", alert: AlertModel): void;
    (command: "clear"): void;
}

@Injectable()
export class AlertsService {

    private observers: IAlertObserver[] = [];

    public addAlertObserver(handler: IAlertObserver): () => void {
        this.observers.push(handler);
        return () => {
            ListHelpers.remove(this.observers, handler);
        }
    }

    public error(text: string) {
        this.showAlert(new AlertModel(text, "danger"));
    }

    public success(text: string) {
        this.showAlert(new AlertModel(text, "success"));
    }

    public warning(text: string) {
        this.showAlert(new AlertModel(text, "warning"));
    }

    public info(text: string) {
        this.showAlert(new AlertModel(text, "info"));
    }

    dismissAll(): any {
        this.foreachObserver(observer => observer("clear"));
    }

    private showAlert(alert: AlertModel) {
        this.foreachObserver(observer => observer("add", alert));
    }

    private foreachObserver(handler: (IAlertObserver) => void) {
        for (var i = 0; i < this.observers.length; i++) {
            var observer = this.observers[i];
            handler(observer);
        }
    }
}