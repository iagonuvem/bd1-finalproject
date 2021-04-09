import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoringPage } from './tutoring.page';

describe('TutoringPage', () => {
  let component: TutoringPage;
  let fixture: ComponentFixture<TutoringPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoringPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoringPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
