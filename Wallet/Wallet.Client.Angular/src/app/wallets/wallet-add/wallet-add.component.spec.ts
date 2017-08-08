import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAddComponent } from './wallet-add.component';

describe('WalletAddComponent', () => {
  let component: WalletAddComponent;
  let fixture: ComponentFixture<WalletAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
