import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbunsPage } from './albuns.page';

describe('AlbunsPage', () => {
  let component: AlbunsPage;
  let fixture: ComponentFixture<AlbunsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbunsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbunsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
