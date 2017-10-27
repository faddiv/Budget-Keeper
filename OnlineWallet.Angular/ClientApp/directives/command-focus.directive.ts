import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer } from '@angular/core';
import { FocusService } from './focus.service';

@Directive({
  selector: '[focus-id]'
})
export class CommandFocusDirective implements OnChanges {

  @Input("focus-id")
  focusId: string;

  private destroy: () => void;

  constructor(
    private element: ElementRef,
    private renderer: Renderer,
    private focusService: FocusService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["focusId"]) {
      this.listenFocus();
    }
  }

  listenFocus() {
    if (this.destroy) {
      this.destroy();
    }
    if (this.focusId) {
      this.destroy =
        this.focusService.subscribe(this.focusId, () => {
          this.renderer.invokeElementMethod(this.element.nativeElement, "focus");
        });
    }
  }
}
