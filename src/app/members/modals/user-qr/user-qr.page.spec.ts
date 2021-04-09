import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQrPage } from './user-qr.page';

describe('UserQrPage', () => {
  let component: UserQrPage;
  let fixture: ComponentFixture<UserQrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
