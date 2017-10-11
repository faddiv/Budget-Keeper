import { CommandFocusDirective } from './command-focus.directive';
import { ElementRef } from '@angular/core';

describe('CommandFocusDirective', () => {
  it('should create an instance', () => {
    const directive = new CommandFocusDirective(new ElementRef({
      focus: jasmine.createSpy("focus")
    }));
    expect(directive).toBeTruthy();
  });
});
