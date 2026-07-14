import { TestBed } from '@angular/core/testing';

import { AvatarLoader } from './avatar-loader';

describe('AvatarLoader', () => {
  let service: AvatarLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarLoader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
