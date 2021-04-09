import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorsPage } from './coordinators.page';

describe('CoordinatorsPage', () => {
  let component: CoordinatorsPage;
  let fixture: ComponentFixture<CoordinatorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordinatorsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
