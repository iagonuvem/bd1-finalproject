import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypePage } from './user-type.page';

describe('UserTypePage', () => {
  let component: UserTypePage;
  let fixture: ComponentFixture<UserTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
