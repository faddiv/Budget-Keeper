import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTableRowComponent } from './wallet-table-row.component';

describe('WalletTableRowComponent', () => {
  let component: WalletTableRowComponent;
  let fixture: ComponentFixture<WalletTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletTableRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
