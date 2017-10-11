import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wallets-filter-row',
  templateUrl: './wallets-filter-row.component.html'
})
export class WalletsFilterRowComponent implements OnInit {

  @Output()
  reload = new EventEmitter<string>(false);

  searchText: string;

  constructor() { }

  ngOnInit() {
  }

  onReload($event: Event) {
    $event.preventDefault();
    this.reload.emit(this.searchText);
  }
}
