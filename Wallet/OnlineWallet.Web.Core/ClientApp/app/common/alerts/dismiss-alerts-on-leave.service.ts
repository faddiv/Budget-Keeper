import { Injectable } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AlertsService } from "./alerts.service";

@Injectable()
export class DismissAlertsOnLeaveService implements CanDeactivate<any> {
    constructor(
        private alertsService: AlertsService
    ) {
    }

    canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
        this.alertsService.dismissAll();
        return true;
    }
}