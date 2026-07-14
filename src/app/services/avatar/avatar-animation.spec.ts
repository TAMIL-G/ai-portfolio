import { TestBed } from '@angular/core/testing';

import { AvatarAnimation } from './avatar-animation';

describe('AvatarAnimation', () => {
  let service: AvatarAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
