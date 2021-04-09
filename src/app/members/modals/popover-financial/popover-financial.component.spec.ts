import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFinancialComponent } from './popover-financial.component';

describe('PopoverFinancialComponent', () => {
  let component: PopoverFinancialComponent;
  let fixture: ComponentFixture<PopoverFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFinancialComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
