import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletsFilterRowComponent } from './wallets-filter-row.component';

describe('WalletsFilterRowComponent', () => {
  let component: WalletsFilterRowComponent;
  let fixture: ComponentFixture<WalletsFilterRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletsFilterRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletsFilterRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
