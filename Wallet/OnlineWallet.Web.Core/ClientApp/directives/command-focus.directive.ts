import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICommand } from "directives/ICommand";

@Directive({
  selector: '[focus-command]'
})
export class CommandFocusDirective implements OnChanges {

  @Input("focus-command")
  commandFocus: ICommand<any>;

  constructor(private element: ElementRef) {
    if (!element.nativeElement.focus || typeof (element.nativeElement.focus) !== "function") {
      throw "Element is not focusable: " + JSON.stringify(element.nativeElement);
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.setExecuteCommand();
  }

  setExecuteCommand() {
    if (this.commandFocus && typeof (this.commandFocus) === "object" && !this.commandFocus.execute) {
      this.commandFocus.execute = () => {
        this.element.nativeElement.focus();
      }
    }
  }

}
