import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTutoringPage } from './set-tutoring.page';

describe('SetTutoringPage', () => {
  let component: SetTutoringPage;
  let fixture: ComponentFixture<SetTutoringPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetTutoringPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetTutoringPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
