import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPage } from './financial.page';

describe('FinancialPage', () => {
  let component: FinancialPage;
  let fixture: ComponentFixture<FinancialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
