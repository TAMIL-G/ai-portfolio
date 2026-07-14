import { TestBed } from '@angular/core/testing';

import { Lighting } from './lighting';

describe('Lighting', () => {
  let service: Lighting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lighting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
