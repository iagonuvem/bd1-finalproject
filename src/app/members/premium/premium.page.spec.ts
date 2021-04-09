import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPage } from './premium.page';

describe('PremiumPage', () => {
  let component: PremiumPage;
  let fixture: ComponentFixture<PremiumPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
