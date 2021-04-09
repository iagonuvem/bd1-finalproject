import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassChatPage } from './class-chat.page';

describe('ClassChatPage', () => {
  let component: ClassChatPage;
  let fixture: ComponentFixture<ClassChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
