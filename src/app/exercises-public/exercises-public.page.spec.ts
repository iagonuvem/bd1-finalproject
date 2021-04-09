import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesPublicPage } from "./ExercisesPublicPage";

describe('ExercisesPublicPage', () => {
  let component: ExercisesPublicPage;
  let fixture: ComponentFixture<ExercisesPublicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExercisesPublicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesPublicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
