import { TestBed } from '@angular/core/testing';

import { LipSync } from './lip-sync';

describe('LipSync', () => {
  let service: LipSync;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LipSync);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
