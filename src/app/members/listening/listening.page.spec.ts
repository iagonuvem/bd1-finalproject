import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeningPage } from './listening.page';

describe('ListeningPage', () => {
  let component: ListeningPage;
  let fixture: ComponentFixture<ListeningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeningPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
