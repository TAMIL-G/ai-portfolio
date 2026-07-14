import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingText } from './typing-text';

describe('TypingText', () => {
  let component: TypingText;
  let fixture: ComponentFixture<TypingText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingText],
    }).compileComponents();

    fixture = TestBed.createComponent(TypingText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
