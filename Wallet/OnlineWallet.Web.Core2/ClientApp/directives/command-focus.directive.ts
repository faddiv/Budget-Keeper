import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { ICommand } from "directives/ICommand";

@Directive({
  selector: '[focus-command]'
})
export class CommandFocusDirective implements OnChanges {

  @Input("focus-command")
  commandFocus: ICommand<any>;

  constructor(
      private element: ElementRef
  ) {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.setExecuteCommand();
  }

  setExecuteCommand() {
    if (this.commandFocus && typeof (this.commandFocus) === "object" && !this.commandFocus.execute) {
        this.commandFocus.execute = () => {
            var focus = this.element.nativeElement && this.element.nativeElement.focus;
            if (typeof focus === "function") {
                focus.apply(this.element.nativeElement);
            }
      }
    }
  }

}
