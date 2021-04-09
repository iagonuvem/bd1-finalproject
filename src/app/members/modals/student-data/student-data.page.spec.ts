import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDataPage } from './student-data.page';

describe('StudentDataPage', () => {
  let component: StudentDataPage;
  let fixture: ComponentFixture<StudentDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
