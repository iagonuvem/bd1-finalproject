import { TestBed } from '@angular/core/testing';

import { InstaService } from './insta.service';

describe('InstaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstaService = TestBed.get(InstaService);
    expect(service).toBeTruthy();
  });
});
