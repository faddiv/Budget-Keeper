import { Component, OnInit, Input } from '@angular/core';
import { AlertModel } from './AlertModel';
import { ListHelpers } from 'walletCommon';
import { AlertsService } from './alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html'
})
export class AlertsComponent implements OnInit {

  alerts: AlertModel[] = [];

  constructor(
    private alertsService: AlertsService) {
    this.alertsService.addAlertObserver((command: string, alert?: AlertModel) => {
      switch (command) {
          case "add":
              if (alert) {
                  this.alerts.push(alert);
              }
          break;
        case "clear":
          ListHelpers.clear(this.alerts);
          break;
        default:
          break;
      }
    });
  }

  ngOnInit() {
  }

  dismiss(item: AlertModel) {
    ListHelpers.remove(this.alerts, item);
  }
}
