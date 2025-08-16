import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPayment } from './pending-payment';

describe('PendingPayment', () => {
  let component: PendingPayment;
  let fixture: ComponentFixture<PendingPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
