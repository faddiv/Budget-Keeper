import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wallets-filter-row',
  templateUrl: './wallets-filter-row.component.html',
  styleUrls: ['./wallets-filter-row.component.scss']
})
export class WalletsFilterRowComponent implements OnInit {

  @Output()
  reload = new EventEmitter(false);

  constructor() { }

  ngOnInit() {
  }

  onReload() {
    this.reload.emit();
  }
}
