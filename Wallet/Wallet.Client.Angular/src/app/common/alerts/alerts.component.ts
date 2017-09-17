import { Component, OnInit, Input } from '@angular/core';
import { AlertModel } from './AlertModel';
import { ListHelpers } from 'walletCommon';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  @Input()
  alerts: AlertModel[];

  constructor() { }

  ngOnInit() {
  }

  dismiss(item: AlertModel) {
    ListHelpers.remove(this.alerts, item);
  }
}
